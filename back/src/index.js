const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema, valueFromASTUntyped } = require('graphql')
const expressPlayground =
  require('graphql-playground-middleware-express').default
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const Persistence = require('./persistence')
const _ = require('lodash')
const denormalize = require('./denormalize')
const recursiveReaddir = require('./recursiveReaddir.js')
const Mqtt = require('./mqtt')
const Modbus = require('./modbus')
const config = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'runtime/config.json'))
)
const variables = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), `runtime/variables.json`))
)
const classes = fs
  .readdirSync(path.resolve(process.cwd(), 'runtime/classes'))
  .map((filename) => {
    const classes = require(path.resolve(
      process.cwd(),
      `runtime/classes/${filename}`
    ))
    return classes
  })
  .reduce((acc, current) => {
    return [...acc, ...current]
  })

const app = express()
app.use(cors())

const schema = buildSchema(`
    type atomicVariable {
      path: String!
      value: String!
      datatype: String!
    }
    type VariableSourceParams {
      register: Int!
      registerType: String!
      format: String!
    }
    type VariableSource {
      type: String!
      name: String!
      rate: Int!
      params: VariableSourceParams
    }
    type Variable {
      name: String!
      description: String
      datatype: String!
      initialValue: String
      persistent: Boolean
      source: VariableSource
      children: [Variable!]!
    }
    type configTask {
      name: String!
      description: String!
      scanRate: Int!
      program: String!
    }
    type configMqttConfig {
      serverUrl: String
      groupId: String
      username: String
      password: String
      edgeNode: String
      deviceName: String
      clientId: String
      version: String
    }
    type configModbusConfig {
      host: String
      port: Int
      unitId: Int,
      reverseBits: Boolean,
      reverseWords: Boolean,
      zeroBased: Boolean,
      retryRate: Int
    }
    type configMqtt {
      name: String!
      description: String!
      config: configMqttConfig!
    }
    type configModbus {
      name: String!
      description: String!
      config: configModbusConfig!
    }
    type config {
      tasks: [configTask!]!
      mqtt: [configMqtt!]!
      modbus: [configModbus!]!
    }
    type taskMetric {
      task: String!
      functionExecutionTime: Float!
      intervalExecutionTime: Float!
      totalScanTime: Float!
    }
    type Mutation {
      setValue(variablePath: String!, value: String!): atomicVariable
      runFunction(functionPath: String!, args: String): String
    }
    type Query {
      info: String!
      metrics: [taskMetric!]!
      value(variablePath: String!): atomicVariable
      values: [atomicVariable!]!
      variables: [Variable!]!
      programs: [String!]!
      program(name: String!): String!
      functions: [String!]!
      function(name: String!): String!
      classes: [String!]!
      class(name: String!): String!
      configuration: config!
    }
  `)

let mainInterval

const global = {}
const metrics = {}
const mqtt = {}
const modbus = {}
let persistence

const rootValue = {
  info: 'A Modern SoftPLC.',
  metrics: function (args, context, info) {
    return Object.keys(context.metrics).map((key) => {
      return {
        task: key,
        ...context.metrics[key],
      }
    })
  },
  configuration: function (args, context) {
    return {
      tasks: Object.keys(context.config.tasks).map((key) => {
        return {
          name: key,
          description: context.config.tasks[key].description
            ? context.config.tasks[key].description
            : '',
          ...context.config.tasks[key],
        }
      }),
      mqtt: Object.keys(context.config.mqtt).map((key) => {
        return {
          name: key,
          description: context.config.mqtt[key].description
            ? context.config.mqtt[key].description
            : '',
          ...context.config.mqtt[key],
        }
      }),
      modbus: Object.keys(context.config.modbus).map((key) => {
        return {
          name: key,
          description: context.config.modbus[key].description
            ? context.config.modbus[key].description
            : '',
          ...context.config.modbus[key],
        }
      }),
    }
  },
  value: function (args, context, info) {
    const variable = _.get(context.global, args.variablePath)
    if (variable !== undefined) {
      return {
        path: args.variablePath,
        value: variable,
        datatype: typeof variable,
      }
    } else {
      throw Error(`${args.variablePath} does not exits.`)
    }
  },
  values: function (args, context, info) {
    const values = denormalize(context.global)
    return Object.keys(values).map((key) => {
      return {
        path: key,
        value: values[key],
        datatype: typeof values[key],
      }
    })
  },
  setValue: function (args, context, info) {
    const variable = _.get(context.global, args.variablePath)
    if (variable !== undefined) {
      if (typeof variable == 'boolean') {
        _.set(context.global, args.variablePath, args.value === 'true')
      }
      return {
        path: args.variablePath,
        value: args.value,
        datatype: typeof variable,
      }
    } else {
      throw Error(`${args.variablePath} does not exits.`)
    }
  },
  variables: function (args, context, info) {
    try {
      return Object.keys(context.variables).map((key) => {
        const atomicDatatypes = ['string', 'boolean', 'number']
        let children = []
        if (!atomicDatatypes.includes(context.variables[key].datatype)) {
          const variableClass = context.classes.find(
            (item) => item.name === context.variables[key].datatype
          )
          children = Object.keys(variableClass.variables).map((childKey) => {
            return {
              name: childKey,
              ...variableClass.variables[childKey],
            }
          })
        }
        return {
          name: key,
          description: context.variables[key].description
            ? context.variables[key].description
            : '',
          ...context.variables[key],
          children,
        }
      })
    } catch (error) {
      console.log(error)
    }
  },
  runFunction: function (args, context, info) {
    const func = _.get(context.global, args.functionPath)
    if (func !== undefined) {
      if (typeof func === 'function') {
        const functionPathParts = args.functionPath.split('.')
        const functionName = functionPathParts.pop()
        const parent = _.get(context.global, functionPathParts.join('.'))
        if (func.length === 0) {
          parent[functionName]()
        } else {
          parent[functionName](...args.args)
        }
      } else {
        throw Error(`${args.functionPath} exists, but is not a function.`)
      }
    } else {
      throw Error(`${args.functionPath} does not exits.`)
    }
  },
  program: function (args, context, info) {
    return fs.readFileSync(
      path.resolve(process.cwd(), 'runtime/programs', args.name),
      { encoding: 'utf8', flag: 'r' }
    )
  },
  program: function (args, context, info) {
    return fs.readFileSync(
      path.resolve(process.cwd(), 'runtime/programs', args.name),
      { encoding: 'utf8', flag: 'r' }
    )
  },
  programs: function (args, context, info) {
    return recursiveReaddir(
      path.resolve(process.cwd(), 'runtime/programs')
    ).map((file) => file.replace(`${process.cwd()}/runtime/programs/`, ''))
  },
  function: function (args, context, info) {
    return fs.readFileSync(
      path.resolve(process.cwd(), 'runtime/functions', args.name),
      { encoding: 'utf8', flag: 'r' }
    )
  },
  functions: function (args, context, info) {
    return fs
      .readdirSync(path.resolve(process.cwd(), 'runtime/functions'))
      .map((file) => file.replace(`${process.cwd()}/runtime/functions/`, ''))
  },
  class: function (args, context, info) {
    return fs.readFileSync(
      path.resolve(process.cwd(), 'runtime/classes', args.name),
      { encoding: 'utf8', flag: 'r' }
    )
  },
  classes: function (args, context, info) {
    return fs
      .readdirSync(path.resolve(process.cwd(), 'runtime/classes'))
      .map((file) => file.replace(`${process.cwd()}/runtime/classes/`, ''))
  },
}

const context = {
  classes,
  global,
  metrics,
  config,
  mqtt,
  modbus,
  variables,
}

app.get(
  '/playground',
  expressPlayground({
    endpoint: '/',
  })
)

app.use(
  graphqlHTTP({
    schema,
    rootValue,
    context,
  })
)

var errorHandler = require('errorhandler')
app.use(errorHandler({ dumpExceptions: true, showStack: true }))

app.listen(4000, async () => {
  try {
    const intervals = []
    Object.keys(config.modbus).forEach((modbusKey) => {
      modbus[modbusKey] = new Modbus({
        ...config.modbus[modbusKey].config,
        global,
      })
      modbus[modbusKey].connect()
    })
    Object.keys(config.mqtt).forEach((mqttKey) => {
      mqtt[mqttKey] = new Mqtt({
        ...config.mqtt[mqttKey].config,
        global,
      })
      mqtt[mqttKey].connect()
      // try {
      // mqtt[mqttKey].startPublishing()
      // } catch (error) {
      //   console.error(error)
      // }
    })
    Object.keys(variables).forEach((variableKey) => {
      const variable = variables[variableKey]
      if (variable.datatype === 'number') {
        global[variableKey] = variable.initialValue
      } else if (classes.map((item) => item.name).includes(variable.datatype)) {
        variableClass = classes.find((item) => item.name === variable.datatype)
        global[variableKey] = new variableClass(variable.config)
        global[variableKey].name = variableKey
      } else {
        console.log(`the datatype for ${variableKey} is invalid`)
      }
    })
    persistence = new Persistence({ variables, global, classes })
    context.persistence = persistence
    persistence.load()
    Object.keys(variables).forEach((variableKey) => {
      const variable = variables[variableKey]
      if (variable.source) {
        if (variable.source.type === 'modbus') {
          setInterval(() => {
            if (modbus[variable.source.name].connected) {
              modbus[variable.source.name]
                .read(variable.source.params)
                .then((result) => (global[variableKey] = result))
            }
          }, variable.source.rate)
        }
      }
    })
    Object.keys(config.tasks).forEach((taskKey) => {
      metrics[taskKey] = {}
      let intervalStart
      intervals.push({
        interval: setInterval(
          async ({ global, persistence, metrics, taskKey }) => {
            intervalStop = intervalStart ? process.hrtime(intervalStart) : 0
            metrics[taskKey].intervalExecutionTime = intervalStop
              ? (intervalStop[0] * 1e9 + intervalStop[1]) / 1e6
              : 0
            functionStart = process.hrtime()
            try {
              await require(path.resolve(
                process.cwd(),
                `runtime/programs/${config.tasks[taskKey].program}.js`
              ))({ global })
              functionStop = process.hrtime(functionStart)
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
          config.tasks[taskKey].scanRate,
          { global, persistence, metrics, taskKey }
        ),
        scanRate: config.tasks[taskKey].scanRate,
        name: taskKey,
      })
    })
    console.log('server started on port 4000.')
  } catch (error) {
    console.log(error)
  }
})

process.on('uncaughtException', function (exception) {
  console.log(exception) // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
})
