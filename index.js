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

const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'runtime/config.json'))
)

const app = express()
app.use(cors())

const schema = buildSchema(`
  type atomicVariable {
    path: String!
    value: String!
    datatype: String!
  }
  type configTask {
    name: String!
    description: String!
    scanRate: Int!
    program: String!
  }
  type configMqtt {
    name: String!
    description: String!
    endpoint: String!
  }
  type config {
    tasks: [configTask!]!
    mqtt: [configMqtt!]!
  }
  type taskMetric {
    task: String!
    functionExecutionTime: Float!
    intervalExecutionTime: Float!
    totalScanTime: Float!
  }
  type Mutation {
    loadProgram(program: String!): String
    setValue(variablePath: String!, value: String!): atomicVariable
  }
  type Query {
    info: String!
    metrics: [taskMetric!]!
    value(variablePath: String!): atomicVariable
    values: [atomicVariable!]!
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
  program: function (args, context, info) {
    return fs.readFileSync(
      path.resolve(__dirname, 'runtime/programs', args.name),
      { encoding: 'utf8', flag: 'r' }
    )
  },
  program: function (args, context, info) {
    return fs.readFileSync(
      path.resolve(__dirname, 'runtime/programs', args.name),
      { encoding: 'utf8', flag: 'r' }
    )
  },
  programs: function (args, context, info) {
    return recursiveReaddir(path.resolve(__dirname, 'runtime/programs')).map(
      (file) => file.replace(`${__dirname}/runtime/programs/`, '')
    )
  },
  function: function (args, context, info) {
    return fs.readFileSync(
      path.resolve(__dirname, 'runtime/functions', args.name),
      { encoding: 'utf8', flag: 'r' }
    )
  },
  functions: function (args, context, info) {
    return fs
      .readdirSync(path.resolve(__dirname, 'runtime/functions'))
      .map((file) => file.replace(`${__dirname}/runtime/functions/`, ''))
  },
  class: function (args, context, info) {
    return fs.readFileSync(
      path.resolve(__dirname, 'runtime/classes', args.name),
      { encoding: 'utf8', flag: 'r' }
    )
  },
  classes: function (args, context, info) {
    return fs
      .readdirSync(path.resolve(__dirname, 'runtime/classes'))
      .map((file) => file.replace(`${__dirname}/runtime/classes/`, ''))
  },
  // loadProgram: (args) => {
  //   if (mainInterval) {
  //     clearInterval(mainInterval)
  //   }
  //   mainProgram = Function(args.program)
  //   mainInterval = setInterval(mainProgram, 1000)
  // },
}

const context = {
  global,
  metrics,
  config,
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

app.listen(4000, async () => {
  const variables = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `runtime/variables.json`))
  )
  const classes = fs
    .readdirSync(path.resolve(__dirname, 'runtime/classes'))
    .map((filename) => {
      const classes = require(path.resolve(
        __dirname,
        `runtime/classes/${filename}`
      ))
      return classes
    })
    .reduce((acc, current) => {
      return [...acc, ...current]
    })
  const intervals = []
  Object.keys(config.tasks).forEach((taskKey) => {
    metrics[taskKey] = {}
    Object.keys(variables).forEach((variableKey) => {
      variable = variables[variableKey]
      if (variable.datatype === 'Number') {
        global[variableKey] = variable.initialValue
      } else if (classes.map((item) => item.name).includes(variable.datatype)) {
        variableClass = classes.find((item) => item.name === variable.datatype)
        global[variableKey] = new variableClass(variable.config)
      } else {
        console.log(`the datatype for ${variableKey} is invalid`)
      }
    })
    persistence = new Persistence({ variables, global, classes })
    context.persistence = persistence
    persistence.load()
    let intervalStart
    intervals.push({
      interval: setInterval(
        ({ global, persistence, metrics, taskKey }) => {
          intervalStop = intervalStart ? process.hrtime(intervalStart) : 0
          metrics[taskKey].intervalExecutionTime = intervalStop
            ? (intervalStop[0] * 1e9 + intervalStop[1]) / 1e6
            : 0
          functionStart = process.hrtime()
          try {
            require(path.resolve(
              __dirname,
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
})
