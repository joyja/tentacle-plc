const { rejects } = require('assert')
const fs = require('fs')
const { VariablesInAllowedPositionRule } = require('graphql')
const path = require('path')

class Persistence {
  constructor({ filepath = path.resolve(__dirname, 'runtime/persistence.json'), variables, global, classes}) {
    if (fs.existsSync(filepath)) {
      this.data = JSON.parse(fs.readFileSync(filepath))
    } else {
      this.data = {}
      fs.writeFileSync(filepath,JSON.stringify(this.data))
    }
    this.global = global
    this.variables = variables
    this.classes = classes
    this.filepath = filepath
  }
  load() {
    Object.keys(this.global).forEach((key) => {
      if (this.classes.map(fb => fb.name).includes(this.global[key].constructor.name)) {
        console.log(`${key} is an fb of type ${this.global[key].constructor.name}`)
        this.global[key].constructor.persistentData.forEach((variableName) => {
          if (variableName in this.data[key]) {
            this.global[key][variableName] = this.data[key][variableName]
          }
        })
      } else {
        console.log(`${key} is a primitive of type ${typeof this.global[key]}`)
        this.global[key] = this.data[key]
      }
    })
  }
  persist() {
    const newData = {}
    Object.keys(this.global).forEach((key) => {
      if (this.classes.map(fb => fb.name).includes(this.global[key].constructor.name)) {
        console.log(`${key} is an fb of type ${this.global[key].constructor.name}`)
        const fbData = {}
        this.global[key].constructor.persistentData.forEach((variableName) => {
          console.log(this.global[key])
          fbData[variableName] = this.global[key][variableName]
        })
        newData[key] = fbData
      } else {
        console.log(`${key} is a primitive of type ${typeof this.global[key]}`)
        newData[key] = this.global[key]
      }
    })
    this.data = newData
    try {
      this.writeFile(this.data)
    } catch (error) {
      console.log(error)
    }
  }
  async writeFile(content) {
    fs.writeFileSync(this.filepath, JSON.stringify(content), (error) => {
      if (error) {
        return rejects(error)
      }
      resolve({ file: file, content: content })
    })
  }
}

module.exports = Persistence
