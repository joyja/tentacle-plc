const {
  DataType,
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  makeBrowsePath,
  NodeCrawler,
} = require('node-opcua')

class Opcua {
  constructor({
    initialDelay = 1000,
    maxRetry = 1,
    applicationName = 'tentacle-plc',
    host,
    port,
    retryRate,

  }) {
    this.host = host
    this.port = port
    this.retryRate = retryRate
    this.connected = false
    this.error = null
    this.retryCount = 0
    this.nodes = null
    options = {
      applicationName,
      connectionStrategy: {
        initialDelay,
        maxRetry
      },
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpoint_must_exist: false,
    }
    this.client = OPCUAClient.create(options)
    this.client.on('connection_failed', async () => {
      if (this.connected) {
        await this.disconnect()
        await this.connect()
      }
    })
    this.client.on('connection_lost', async () => {
      if (this.connected) {
        await this.disconnect()
        await this.connect()
      }
    })
  }
  async connect() {
    if (!this.connected) {
      this.error = null
      console.log(
        `Connecting to opcua device ${this.device.name}, host: ${this.host}, port: ${this.port}.`
      )
      await this.client
        .connect(`opc.tcp://${this.host}:${this.port}`)
        .catch((error) => {
          this.error = error.message
          this.connected = false
          if (!this.retryInterval) {
            this.retryInterval = setInterval(async () => {
              console.log(
                `Retrying connection to opcua device ${this.device.name}, retry attempts: ${this.retryCount}.`
              )
              this.retryCount += 1
              await this.connect()
            }, this.retryRate)
          }
        })
      if (!this.error) {
        this.retryCount = 0
        this.retryInterval = clearInterval(this.retryInterval)
        console.log(
          `Connected to opcua device ${this.device.name}, host: ${this.host}, port: ${this.port}.`
        )
        this.connected = true
        this.session = await this.client.createSession()
      } else {
        this.connected = false
        console.log(
          `Connection failed to opcua device ${this.device.name}, host: ${this.host}, port: ${this.port}, with error: ${this.error}.`
        )
      }
      this.pubsub.publish('deviceUpdate', {
        deviceUpdate: this.device,
      })
    }
  }
}

module.exports = Opcua