const sparkplug = require('tentacle-sparkplug-client')
const getUnixTime = require('date-fns/getUnixTime')
const denormalize = require('./denormalize')
const { clear } = require('tentacle-sparkplug-client/src/logger')

const getDatatype = function (value) {
  if (typeof value === 'boolean') {
    return 'bool'
  } else if (typeof value === 'string') {
    return 'string'
  } else if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return 'uint32'
    } else {
      return 'float'
    }
  } else {
    throw Error(`datatype of ${key} could not be determined.`)
  }
}

class Mqtt {
  constructor({
    serverUrl = 'tcp://localhost:1883',
    username,
    password,
    groupId,
    edgeNode,
    deviceName,
    rate,
    clientId,
    version = 'spBv1.0',
    global
  }) {
    this.rate = rate
    this.global = global
    this.prevGlobal = JSON.parse(JSON.stringify(this.denormalizedGlobal))
    this.deviceName = deviceName
    this.config = {
      serverUrl,
      username,
      password,
      groupId,
      edgeNode,
      clientId,
      version,
    }
  }
  get denormalizedGlobal() {
    return denormalize(this.global)
  }
  publish() {
    const currentGlobal = this.denormalizedGlobal
    const changed = {}
    Object.keys(currentGlobal).forEach((key) => {
      if (currentGlobal[key] !== this.prevGlobal[key]) {
        changed[key] = currentGlobal[key] 
      }
    })
    const payload = Object.keys(changed[key]).map((key) => {
      return {
        name: key,
        value: changed[key],
        type: getDatatype(changed[key]),
        timestamp: getUnixTime(new Date())
      }
    })
    this.prevGlobal = JSON.parse(JSON.stringify(this.denormalizedGlobal))
  }
  startPublishing() {
    this.interval = clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.publish()
    }, this.rate)
  }
  stopPublishing() {
    this.interval = clearInterval(this.interval)
  }
  connect() {
    if (!this.client){
      this.client = sparkplug.newClient(this.config)
      // this.client.on('reconnect',this.onReconnect)
      // this.client.on('error',this.onError)
      // this.client.on('offline',this.onOffline)
      this.client.on('birth',() => {
        this.onBirth()
      })
      // this.client.on('dcmd',this.onDcmd)
      // this.client.on('ncmd',this.onNcmd)
    }
  }
  disconnect() {
    if (this.client) {
      logger.info(`Mqtt service ${this.service.name} is disconnecting.`)
      this.stopPublishing()
      const payload = {
        timestamp: getUnixTime(new Date()),
      }
      this.client.publishDeviceDeath(this.deviceName, payload)
      this.client.stop()
      this.client = undefined
    }
  }
  async onBirth() {
    const payload = {
      timestamp: getUnixTime(new Date()),
      metrics: [],
    }
    await this.client.publishNodeBirth(payload)
    const global = this.denormalizedGlobal
    await this.client.publishDeviceBirth(this.deviceName, {
      timestamp: getUnixTime(new Date()),
      metrics: Object.keys(global).map((key) => {
        return {
          name: key,
          value: global[key],
          type: getDatatype(global[key]),
          timestamp: getUnixTime(new Date())
        }
      })
    })
  }
}

module.exports = Mqtt
