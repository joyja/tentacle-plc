const path = require('path')
const fs = require('fs')
const Persistence = require('./persistence')
const chokidar = require('chokidar')
const Mqtt = require('./mqtt')
const Modbus = require('./modbus')
const Opcua = require('./opcua')

class PLC {
  constructor() {
    this.modbus = {}
    this.opcua = {}
    this.mqtt = {}
    this.intervals = []
    this.global = {}
    this.metrics = {}
    this.running = false
    this.runtimeDir = path.resolve(process.cwd(), 'runtime')
    if (!fs.existsSync(this.runtimeDir)) {
      fs.mkdirSync(this.runtimeDir)
    }
    this.runtimeConfigFile = path.resolve(this.runtimeDir, 'config.json')
    if (!fs.existsSync(this.runtimeConfigFile)) {
      fs.writeFileSync(
        this.runtimeConfigFile,
        JSON.stringify({ tasks: {}, mqtt: {}, modbus: {}, opcua: {} }, null, 2)
      )
    }
    this.runtimeVariableFile = path.resolve(this.runtimeDir, 'variables.json')
    if (!fs.existsSync(this.runtimeVariableFile)) {
      fs.writeFileSync(this.runtimeVariableFile, JSON.stringify({}, null, 2))
    }
    this.runtimeClassesDir = path.resolve(this.runtimeDir, 'classes')
    if (!fs.existsSync(this.runtimeClassesDir)) {
      fs.mkdirSync(this.runtimeClassesDir)
    }
    this.runtimeProgramsDir = path.resolve(this.runtimeDir, 'programs')
    if (!fs.existsSync(this.runtimeProgramsDir)) {
      fs.mkdirSync(this.runtimeProgramsDir)
    }
  }
  getConfig() {
    this.config = JSON.parse(fs.readFileSync(this.runtimeConfigFile))
    this.variables = JSON.parse(fs.readFileSync(this.runtimeVariableFile))
    this.classes = fs
      .readdirSync(path.resolve(this.runtimeClassesDir))
      .map((filename) => {
        delete require.cache[require.resolve(path.resolve(
          this.runtimeClassesDir,
          `${filename}`
        ))]
        const classes = require(path.resolve(
          this.runtimeClassesDir,
          `${filename}`
        ))
        return classes
      })
      .reduce((acc, current) => {
        return [...acc, ...current]
      }, [])
    this.persistence = new Persistence({
      variables: this.variables,
      global: this.global,
      classes: this.classes,
    })
    this.fileChanges = []
    chokidar.watch(this.runtimeDir).on('all', (event, filePath) => {
      if (
        filePath !== path.resolve(process.cwd(), 'runtime/persistence.json')
      ) {
        this.fileChanges.push({
          event,
          path: filePath.replace(process.cwd(), ''),
        })
      }
    })
    setTimeout(() => {
      //Clear out changes so initial files don't get put in the log.
      this.fileChanges.length = 0
    }, 500)
    if (this.config.modbus) {
      Object.keys(this.config.modbus).forEach((modbusKey) => {
        if (this.modbus[modbusKey]) {
          this.modbus[modbusKey].disconnect()
        }
        this.modbus[modbusKey] = new Modbus({
          ...this.config.modbus[modbusKey].config,
          global: this.global,
        })
        this.modbus[modbusKey].connect()
      })
    }
    if (this.config.opcua) {
      Object.keys(this.config.opcua).forEach((opcuaKey) => {
        if (this.opcua[opcuaKey]) {
          this.opcua[opcuaKey].disconnect()
        }
        this.opcua[opcuaKey] = new Opcua({
          ...this.config.opcua[opcuaKey].config,
          global: this.global,
        })
        this.opcua[opcuaKey].connect()
      })
    }
    if (this.config.mqtt) {
      Object.keys(this.config.mqtt).forEach((mqttKey) => {
        if (this.mqtt[mqttKey]) {
          this.mqtt[mqttKey].disconnect()
        }
        this.mqtt[mqttKey] = new Mqtt({
          ...this.config.mqtt[mqttKey].config,
          global: this.global,
        })
        this.mqtt[mqttKey].connect()
      })
    }
  }
  start() {
    if (!this.running) {
      this.getConfig()
      Object.keys(this.variables).forEach((variableKey) => {
        const variable = this.variables[variableKey]
        if (
          variable.datatype === 'number' ||
          variable.datatype === 'boolean' ||
          variable.datatype === 'string'
        ) {
          this.global[variableKey] = variable.initialValue
        } else if (
          this.classes.map((item) => item.name).includes(variable.datatype)
        ) {
          const variableClass = this.classes.find(
            (item) => item.name === variable.datatype
          )
          this.global[variableKey] = new variableClass({
            global: this.global,
            ...variable.config,
          })
          // check for class tasks and run intervals for them
          if (variableClass.tasks) {
            this.global[variableKey].intervals = []
            Object.keys(variableClass.tasks).forEach((taskKey) => {
              this.global[variableKey].intervals.push(setInterval(() => {
                this.global[variableKey][variableClass.tasks[taskKey]['function']]()
              }, variableClass.tasks[taskKey]['scanRate']))
            })
          }
          this.global[variableKey].name = variableKey
        } else {
          console.log(`the datatype for ${variableKey} is invalid`)
        }
      })
      this.persistence.load()
      Object.keys(this.config.tasks).forEach((taskKey) => {
        this.metrics[taskKey] = {}
        let intervalStart
        this.intervals.push({
          interval: setInterval(
            async ({
              global,
              persistence,
              metrics,
              variables,
              modbus,
              opcua,
              taskKey,
            }) => {
              const intervalStop = intervalStart
                ? process.hrtime(intervalStart)
                : 0
              metrics[taskKey].intervalExecutionTime = intervalStop
                ? (intervalStop[0] * 1e9 + intervalStop[1]) / 1e6
                : 0
              const functionStart = process.hrtime()
              try {
                delete require.cache[require.resolve(path.resolve(
                  path.resolve(
                    process.cwd(),
                    `runtime/programs/${this.config.tasks[taskKey].program}.js`
                  )
                ))]
                await require(path.resolve(
                  process.cwd(),
                  `runtime/programs/${this.config.tasks[taskKey].program}.js`
                ))({ global })
                for (const variableKey of Object.keys(this.variables)) {
                  const variable = this.variables[variableKey]
                  if (variable.source) {
                    if (variable.source.type === 'modbus') {
                      await modbus[variable.source.name].write({
                        value: [this.global[variableKey]],
                        ...variable.source.params,
                      })
                      if (this.modbus[variable.source.name].connected) {
                        this.modbus[variable.source.name]
                          .read(variable.source.params)
                          .then((result) => (this.global[variableKey] = result))
                      }
                    }
                    if (variable.source.type === 'opcua') {
                      await opcua[variable.source.name].write({
                        value: [this.global[variableKey]],
                        ...variable.source.params,
                      })
                      if (this.opcua[variable.source.name].connected) {
                        this.opcua[variable.source.name]
                          .read(variable.source.name)
                          .then((result) => (this.global[variableKey] = result))
                      }
                    }
                  }
                }
                const functionStop = process.hrtime(functionStart)
                metrics[taskKey].functionExecutionTime =
                  (functionStop[0] * 1e9 + functionStop[1]) / 1e6
                persistence.persist()
                metrics[taskKey].totalScanTime =
                  metrics.main.functionExecutionTime +
                  metrics.main.intervalExecutionTime
              } catch (error) {
                console.log(error)
              }
              intervalStart = process.hrtime()
            },
            this.config.tasks[taskKey].scanRate,
            {
              global: this.global,
              persistence: this.persistence,
              metrics: this.metrics,
              variables: this.variables,
              modbus: this.modbus,
              opcua: this.opcua,
              taskKey,
            }
          ),
          scanRate: this.config.tasks[taskKey].scanRate,
          name: taskKey,
        })
      })
      this.running = true
    } else {
      throw Error('The PLC is already running.')
    }
  }
  stop() {
    if (this.running) {
      this.intervals.forEach((interval) => {
        clearInterval(interval.interval)
      })
      this.intervals = []
      Object.keys(this.global).forEach((variableKey) => {
        if (this.global[variableKey].intervals) {
          this.global[variableKey].intervals.forEach((interval) => {
            clearInterval(interval)
          })
          this.global[variableKey].intervals = []
        }
      })
      this.running = false
    } else {
      throw Error('The PLC is already stopped.')
    }
  }
  restart() {
    if (this.running) {
      this.stop()
    }
    this.start()
  }
}

module.exports = PLC
