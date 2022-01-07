const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema, valueFromASTUntyped } = require('graphql')
const expressPlayground =
  require('graphql-playground-middleware-express').default
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const Persistence = require('./persistence')

const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'runtime/config.json'))
)

const app = express()
app.use(cors())

const schema = buildSchema(`
  type taskMetric {
    task: String!,
    functionExecutionTime: Float!,
    intervalExecutionTime: Float!,
    totalScanTime: Float!
  }
  type Mutation {
    loadProgram(program: String!): String
  }
  type Query {
    info: String!
    metrics: [taskMetric!]!
  }
`)

let mainInterval

const global = {}
const metrics = {}
let persistence

const rootValue = {
  info: 'A Modern SoftPLC.',
  metrics: function (args, context, somethingelse) {
    return Object.keys(context.metrics).map((key) => {
      return {
        task: key,
        ...context.metrics[key],
      }
    })
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
