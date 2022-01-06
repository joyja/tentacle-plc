const { FunctionBlock } = require('../../functionBlock')

class Motor extends FunctionBlock {
  constructor({ hasRunningInput }) {
    super()
    this.hasRunningInput = hasRunningInput
    this.prevRunning = false
    this.runtime = 0
    this.startCount = 0
    this.startCommand = true
    this.runtimeInterval = setInterval(() => {
      if (this.running) {
        this.runtime = this.runtime + 1 / 60
      }
      if (this.running && !this.prevRunning) {
        this.startCount = this.startCount + 1
        this.prevRunning = this.running
      }
      if (!this.running && this.prevRunning) {
        this.prevRunning = false
      }
    }, 1000)
  }
  autoRequest() {
    this.mode = 'auto'
  }
  manualRequest() {
    this.mode = 'manual'
  }
  startRequest() {
    this.startCommand = true
  }
  stopRequest() {
    this.startCommand = false
  }
  get running() {
    if (this.hasRunningInput) {
      return this.runningInput
    } else {
      return this.startCommand
    }
  }
}
Motor.persistentData = [
  'startCount',
  'runtime',
  'mode',
  'startCommand',
  'prevRunning',
]

module.exports = [Motor]
