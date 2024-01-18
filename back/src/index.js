const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema, valueFromASTUntyped } = require('graphql')
const expressPlayground =
  require('graphql-playground-middleware-express').default
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const denormalize = require('./denormalize')
const recursiveReaddir = require('./recursiveReaddir.js')
const PLC = require('./plc')

const app = express()
app.use(cors())

const schema = buildSchema(
  fs.readFileSync(path.resolve(process.cwd(), 'src/schema.graphql')).toString()
)

const plc = new PLC()
const context = {
  plc,
}

const rootValue = {
  info: 'A Modern SoftPLC.',
  metrics: function (args, context, info) {
    return Object.keys(context.plc.metrics).map((key) => {
      return {
        task: key,
        ...context.plc.metrics[key],
      }
    })
  },
  configuration: function (args, context) {
    return {
      tasks: Object.keys(context.plc.config.tasks).map((key) => {
        return {
          name: key,
          description: context.plc.config.tasks[key].description
            ? context.plc.config.tasks[key].description
            : '',
          ...context.plc.config.tasks[key],
        }
      }),
      mqtt: Object.keys(context.plc.config.mqtt).map((key) => {
        return {
          name: key,
          description: context.plc.config.mqtt[key].description
            ? context.plc.config.mqtt[key].description
            : '',
          ...context.plc.config.mqtt[key],
        }
      }),
      modbus: Object.keys(context.plc.config.modbus).map((key) => {
        return {
          name: key,
          description: context.plc.config.modbus[key].description
            ? context.plc.config.modbus[key].description
            : '',
          ...context.plc.config.modbus[key],
        }
      }),
      opcua: Object.keys(context.plc.config.opcua).map((key) => {
        return {
          name: key,
          description: context.plc.config.opcua[key].description
            ? context.plc.config.opcua[key].description
            : '',
          ...context.plc.config.opcua[key],
        }
      }),
    }
  },
  value: function (args, context, info) {
    const variable = _.get(context.plc.global, args.variablePath)
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
    const values = denormalize(context.plc.global)
    return Object.keys(values).map((key) => {
      return {
        path: key,
        value: values[key],
        datatype: typeof values[key],
      }
    })
  },
  setValue: function (args, context, info) {
    const variable = _.get(context.plc.variables, args.variablePath)
    const global = _.get(context.plc.global, args.variablePath)
    if (variable !== undefined && global !== undefined) {
      if (variable.datatype == 'boolean') {
        _.set(context.plc.global, args.variablePath, args.value === 'true')
      } else if (variable.datatype == 'number') {
        _.set(context.plc.global, args.variablePath, parseFloat(args.value))
      } else {
        _.set(context.plc.global, args.variablePath, args.value)
      }
      return {
        path: args.variablePath,
        value: args.value,
        datatype: variable.datatype,
      }
    } else {
      throw Error(`${args.variablePath} does not exits.`)
    }
  },
  variables: function (args, context, info) {
    try {
      return Object.keys(context.plc.variables).map((key) => {
        const atomicDatatypes = ['string', 'boolean', 'number']
        let children = []
        if (!atomicDatatypes.includes(context.plc.variables[key].datatype)) {
          const variableClass = context.plc.classes.find(
            (item) => item.name === context.plc.variables[key].datatype
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
          description: context.plc.variables[key].description
            ? context.plc.variables[key].description
            : '',
          ...context.plc.variables[key],
          children,
        }
      })
    } catch (error) {
      console.log(error)
    }
  },
  runFunction: function (args, context, info) {
    const func = _.get(context.plc.global, args.functionPath)
    if (func !== undefined) {
      if (typeof func === 'function') {
        const functionPathParts = args.functionPath.split('.')
        const functionName = functionPathParts.pop()
        const parent = _.get(context.plc.global, functionPathParts.join('.'))
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
  programs: function (args, context, info) {
    const result = recursiveReaddir(
      path.resolve(process.cwd(), 'runtime/programs')
    ).map((file) => file.replace(`${process.cwd()}/runtime/programs/`, ''))
    return result
  },
  function: function (args, context, info) {
    return fs.readF
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
  changes: function (args, context, info) {
    return context.plc.fileChanges
  },
  startPlc: function (args, context, info) {
    context.plc.start()
    return context.plc
  },
  stopPlc: function (args, context, info) {
    context.plc.stop()
    return context.plc
  },
  restartPlc: function (args, context, info) {
    context.plc.restart()
    return context.plc
  },
  plc: function (args, context, info) {
    return context.plc
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
    context,
  })
)

app.listen(4000, async () => {
  try {
    plc.start()
    console.log('server started on port 4000.')
  } catch (error) {
    console.log(error)
  }
})

process
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown')
    process.exit(1)
  })
  .on('unhandleRejection', function (reason, p) {
    console.error(reason, 'Unhandled Rejection at Promise', p) // to see your exception details in the console
    // if you are on production, maybe you can send the exception details to your
    // email as well ?
  })
