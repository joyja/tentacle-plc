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
  type Mutation {
    loadProgram(program: String!): String
  }
  type Query {
    info: String!
  }
`)

let mainInterval

const rootValue = {
  info: 'A Modern SoftPLC.',
  loadProgram: (args) => {
    if (mainInterval) {
      clearInterval(mainInterval)
    }
    mainProgram = Function(args.program)
    mainInterval = setInterval(mainProgram, 1000)
  },
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
    let functionString = ``
    const global = {}
    Object.keys(variables).forEach((variableKey) => {
      variable = variables[variableKey]
      console.log(variable.datatype)
      if (variable.datatype === 'Number') {
        global[variableKey] = variable.initialValue
        console.log(variable.initialValue)
      } else if (classes.map((item) => item.name).includes(variable.datatype)) {
        variableClass = classes.find((item) => item.name === variable.datatype)
        global[variableKey] = new variableClass(variable.config)
      } else {
        console.log(`the datatype for ${variableKey} is invalid`)
      }
    })
    const persistence = new Persistence({ variables, global, classes })
    persistence.load()
    intervals.push({/*  */
      interval: setInterval(({ global, persistence }) => {
          try {
            require(path.resolve(
              __dirname,
              `runtime/programs/${config.tasks[taskKey].program}.js`
            ))({ global })
            persistence.persist()
          } catch (error) {
            console.log(error)
          }
        },
        config.tasks[taskKey].scanRate,
        { global, persistence }
      ),
      scanRate: config.tasks[taskKey].scanRate,
      name: taskKey,
    })
  })
  console.log('server started on port 4000.')
})
