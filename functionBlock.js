const { path } = require('path')
const fs = require('fs')

class Persistence {
  constructor(filepath = path.resolve(__dirname, 'runtime/persistence.json')) {
    if (!fs.existsSync(filepath)) {
      this.data = JSON.parse(fs.readFileSync(filepath))
    } else {
      this.data = {}
    }
  }
}

class FunctionBlock {
  constructor() {
    this.constructor.definition
  }
}

module.exports = {
  FunctionBlock,
}
