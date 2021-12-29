const { rejects } = require('assert')
const fs = require('fs')

class Persistence {
  constructor(filepath = path.resolve(__dirname, 'runtime/persistence.json')) {
    if (!fs.existsSync(filepath)) {
      this.data = JSON.parse(fs.readFileSync(filepath))
    } else {
      this.data = {}
    }
  }
  setItem(key, value) => {
    
  }
  async writeFile(file, content) {
    fs.writeFile(file, this.stringify(content), (error) => {
      if (error) {
        return rejects(error)
      }
      resolve({ file: file, content: content })
    })
  }
}
