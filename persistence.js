const { rejects } = require('assert')
const fs = require('fs')
const { VariablesInAllowedPositionRule } = require('graphql')
const path = require('path')

class Persistence {
  constructor({ filepath = path.resolve(__dirname, 'runtime/persistence.json'), variables, global, classes}) {
    this.global = global
    this.variables = variables
    this.classes = classes
    this.filepath = filepath
    if (fs.existsSync(filepath)) {
      this.data = JSON.parse(fs.readFileSync(filepath))
    } else {
      this.data = {}
      this.writeFile()
    }
  }
  load() {
    Object.keys(this.global).forEach((key) => {
      if (this.classes.map(fb => fb.name).includes(this.global[key].constructor.name)) {
        // console.log(`${key} is an fb of type ${this.global[key].constructor.name}`)
        Object.keys(this.global[key].constructor.variables).filter((variableName) => {
          return this.global[key].constructor.variables[variableName].persistent
        }).forEach((variableName) => {
          if (key in this.data && variableName in this.data[key]) {
            this.global[key][variableName] = this.data[key][variableName]
          }
        })
      } else {
        // console.log(`${key} is a primitive of type ${typeof this.global[key]}`)
        if (this.variables[key].persistent && key in this.data) {
          this.global[key] = this.data[key]
        }
      }
    })
  }
  persist() {
    const newData = {}
    Object.keys(this.global).forEach((key) => {
      if (this.classes.map(fb => fb.name).includes(this.global[key].constructor.name)) {
        // console.log(`${key} is an fb of type ${this.global[key].constructor.name}`)
        const fbData = {}
        Object.keys(this.global[key].constructor.variables).filter((variableName) => {
          return this.global[key].constructor.variables[variableName].persistent
        }).forEach((variableName) => {
          // console.log(this.global[key])
          fbData[variableName] = this.global[key][variableName]
        })
        newData[key] = fbData
      } else {
        // console.log(`${key} is a primitive of type ${typeof this.global[key]}`)
        if (this.variables[key].persistent) {
          newData[key] = this.global[key]
        }
      }
    })
    this.data = newData
    try {
      this.writeFile()
    } catch (error) {
      console.log(error)
    }
  }
  async writeFile() {
    fs.writeFileSync(this.filepath, JSON.stringify(this.data, null, 2), (error) => {
      if (error) {
        return rejects(error)
      }
      resolve()
    })
  }
}

module.exports = Persistence
