const sparkplug = require('tentacle-sparkplug-client')
const getUnixTime = require('date-fns/getUnixTime')
const denormalize = require('./denormalize')
const { clear } = require('tentacle-sparkplug-client/src/logger')
const _ = require('lodash')

const getDatatype = function (value) {
  if (typeof value === 'boolean') {
    return 'BOOLEAN'
  } else if (typeof value === 'string') {
    return 'STRING'
  } else if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return 'INT32'
    } else {
      return 'FLOAT'
    }
  } else {
    console.error(`datatype of ${value} could not be determined.`)
    return 'STRING'
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
    global,
    primaryHosts = [],
    maxHistoryToPublish = 10,
  }) {
    this.queue = []
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
      publishDeath: true,
    }
    this.primaryHosts = primaryHosts.map((name) => {
      return {
        name,
        readyForData: false,
        status: 'OFFLINE',
        history: [],
      }
    })
    this.maxHistoryToPublish = maxHistoryToPublish
  }
  get denormalizedGlobal() {
    return denormalize(this.global)
  }
  async publish() {
    if (this.queue.length > 0) {
      const record = {
        timestamp: getUnixTime(new Date()),
        metrics: [...this.queue],
      }
      await this.client.publishDeviceData(this.deviceName, record)
      for (const host of this.primaryHosts) {
        if (!host.readyForData) {
          host.history.push({ ...record, isHistorical: true })
        } else {
          const historyToPublish = host.history.splice(
            0,
            this.maxHistoryToPublish - 1
          )
          for (const storedRecord of historyToPublish) {
            await this.client.publishDeviceData(this.deviceName, storedRecord)
          }
        }
      }
      this.queue = []
    }
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
    this.stopPublishing()
    if (!this.client) {
      this.client = sparkplug.newClient(this.config)
      this.client.on('reconnect', () => {
        this.onReconnect()
      })
      // this.client.on('error',this.onError)
      // this.client.on('offline',this.onOffline)
      this.client.on('birth', () => {
        this.onBirth()
      })
      this.client.on('dcmd', (deviceId, payload) => {
        console.log(`Mqtt service received a dcmd for ${deviceId}.`)
        try {
          this.onDcmd(payload)
        } catch (error) {
          console.log(error)
        }
      })
      this.client.on('ncmd', async (payload) => {
        if (payload.metrics) {
          const rebirth = payload.metrics.find(
            (metric) => metric.name === `Node Control/Rebirth`
          )
          if (rebirth) {
            if (rebirth.value) {
              console.log(`Rebirth request detected. Reinitializing...`)
              await this.disconnect()
              this.connect()
            }
          }
        }
      })
    }
  }
  async disconnect() {
    if (this.client) {
      console.log(`Mqtt service is disconnecting.`)
      this.stopPublishing()
      const payload = {
        timestamp: getUnixTime(new Date()),
      }
      await this.client.publishDeviceDeath(`${this.deviceName}`, payload)
      this.client.stop()
      this.client = undefined
    }
  }
  onDcmd(payload) {
    const { metrics } = payload
    metrics.forEach((metric) => {
      const variablePath = metric.name
        .replace('functions/', '')
        .replaceAll('/', '.')
      const variable = _.get(this.global, variablePath)
      if (variable !== undefined) {
        if (typeof variable == 'boolean') {
          _.set(
            this.global,
            variablePath,
            (typeof metric.value === 'string' && metric.value === 'true') ||
              (typeof metric.value === 'boolean' && metric.value)
          )
        } else if (typeof variable == 'function') {
          // * Need to call the function from the parent to preserve 'this' in classes.
          // * So pop off the function name, get the parent and call the function from the parent.
          const variablePathParts = variablePath.split('.')
          const functionName = variablePathParts.pop()
          const parent = _.get(this.global, variablePathParts.join('.'))
          if (variable.length === 0) {
            parent[functionName]()
          } else {
            parent[functionName](...JSON.parse(metric.value))
          }
        }
      } else {
        console.log(`${variablePath} does not exits.`)
      }
    })
  }
  async onBirth() {
    const payload = {
      timestamp: getUnixTime(new Date()),
      metrics: [
        {
          name: 'Node Control/Rebirth',
          timestamp: getUnixTime(new Date()),
          type: 'Boolean',
          value: false,
        },
      ],
    }
    await this.client.publishNodeBirth(payload)
    const global = this.denormalizedGlobal
    const metrics = Object.keys(global).map((key) => {
      if (typeof global[key] === 'string' && global[key].includes('function')) {
        const keyParts = key.split('.')
        keyParts.splice(keyParts.length - 1, 0, 'functions')
        return {
          name: keyParts.join('/'),
          value:
            global[key] === 'function0'
              ? false
              : `[${','.repeat(
                  parseInt(global[key].replace('function', '')) - 1
                )}]`,
          type: global[key] === 'function0' ? 'BOOLEAN' : 'STRING',
          timestamp: getUnixTime(new Date()),
        }
      } else {
        return {
          name: key.replaceAll('.', '/'),
          value: global[key],
          type: getDatatype(global[key]),
          timestamp: getUnixTime(new Date()),
        }
      }
    })
    await this.client.publishDeviceBirth(`${this.deviceName}`, {
      timestamp: getUnixTime(new Date()),
      metrics,
    })
    this.primaryHosts.forEach((host) => {
      if (host.status === `ONLINE` || host.status === `UNKOWN`) {
        host.readyForData = true
      }
    })
    this.client.on('state', (primaryHostId, state) => {
      if (primaryHostId) {
        const primaryHost = this.primaryHosts
          .filter((host) => host.name === primaryHostId)
          .forEach((host) => {
            console.log(
              `Received state: ${state} for primary host: ${primaryHostId}`
            )
            if (host) {
              host.status = `${state}`
              if (`${state}` === `OFFLINE`) {
                host.readyForData = false
              }
              if (`${state}` === `ONLINE`) {
                host.readyForData = true
              }
            }
          })
      }
    })
    this.startPublishing()
  }
  async onReconnect() {
    this.stopPublishing()
    this.startPublishing()
  }
}

module.exports = Mqtt
