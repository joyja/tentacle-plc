class Motor {
  constructor({ hasRunningInput }) {
    this.functionsFeedback = ''
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
    this.functionsFeedback = `${this.name} placed in auto mode.`
  }
  manualRequest() {
    this.mode = 'manual'
    this.functionsFeedback = `${this.name} placed in manual mode.`
  }
  startRequest() {
    if (this.mode === 'manual') {
      this.startCommand = true
      this.functionsFeedback = `${this.name} manually started.`
    } else {
      this.functionsFeedback = `${this.name} cannot be started manually when it is in auto mode.`
    }
  }
  stopRequest() {
    if (this.mode === 'manual') {
      this.startCommand = false
      this.functionsFeedback = `${this.name} manually stopped.`
    } else {
      this.functionsFeedback = `${this.name} cannot be stopped manually when it is in manual mode.`
    }
  }
  get running() {
    if (this.hasRunningInput) {
      return this.runningInput
    } else {
      return this.startCommand
    }
  }
  set running(value) {
    this.startCommand = value
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
