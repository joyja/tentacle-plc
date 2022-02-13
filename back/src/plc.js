const path = require('path')
const fs = require('fs')
const Persistence = require('./persistence')
const chokidar = require('chokidar')

class PLC {
  constructor() {
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
        runtimeConfigFile,
        JSON.stringify({ tasks: {}, mqtt: {}, modbus: {} }, null, 2)
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
    this.getConfig()
  }
  getConfig() {
    this.config = JSON.parse(fs.readFileSync(this.runtimeConfigFile))
    this.variables = JSON.parse(fs.readFileSync(this.runtimeVariableFile))
    this.classes = fs
      .readdirSync(path.resolve(this.runtimeClassesDir))
      .map((filename) => {
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
    chokidar.watch(this.runtimeDir).on('all', (event, path) => {
      this.fileChanges.push({ event, path })
    })
    setTimeout(() => {
      //Clear out changes so initial files don't get put in the log.
      this.fileChanges.length = 0
    }, 500)
  }
  start() {
    if (!this.running) {
      Object.keys(this.variables).forEach((variableKey) => {
        const variable = this.variables[variableKey]
        if (variable.datatype === 'number') {
          this.global[variableKey] = variable.initialValue
        } else if (
          this.classes.map((item) => item.name).includes(variable.datatype)
        ) {
          const variableClass = this.classes.find(
            (item) => item.name === variable.datatype
          )
          this.global[variableKey] = new variableClass(variable.config)
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
            async ({ global, persistence, metrics, taskKey }) => {
              const intervalStop = intervalStart
                ? process.hrtime(intervalStart)
                : 0
              metrics[taskKey].intervalExecutionTime = intervalStop
                ? (intervalStop[0] * 1e9 + intervalStop[1]) / 1e6
                : 0
              const functionStart = process.hrtime()
              try {
                await require(path.resolve(
                  process.cwd(),
                  `runtime/programs/${this.config.tasks[taskKey].program}.js`
                ))({ global })
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