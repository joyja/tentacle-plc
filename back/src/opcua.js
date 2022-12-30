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
    }
  }
  async disconnect() {
    this.retryCount = 0
    this.retryInterval = clearInterval(this.retryInterval)
    console.log(`Disconnecting from modbus device ${this.device.name}`)
    const logText = `Closed connection to modbus device ${this.device.name}.`
    if (this.connected) {
      await this.session.close()
      await this.client.disconnect()
      console.log(logText)
    } else {
      console.log(logText)
    }
    this.connected = false
  }
  async browse(nodeId, flat = false) {
    if (this.connected) {
      return new Promise((resolve, reject) => {
        const crawler = new NodeCrawler(this.session)
        let firstScan = true
        let flatResult = []
        if (flat) {
          crawler.on('browsed', (element) => {
            if (element.dataValue) {
              flatResult.push({
                nodeId: element.nodeId.toString(),
                browseName: `${element.nodeId.toString()},${
                  element.browseName.name
                }`,
              })
            }
          })
        }
        crawler.read(nodeId || 'ObjectsFolder', (err, obj) => {
          if (!err) {
            if (flat) {
              resolve(flatResult)
            } else {
              resolve(obj)
            }
          } else {
            reject(err)
          }
        })
      })
    } else {
      return flat ? [] : null
    }
  }
  async read({ nodeId }) {
    if (this.connected) {
      try {
        const {
          value: { value },
        } = await this.session
          .readVariableValue(nodeId)
          .catch((error) => logger.error(error))
        return value
      } catch (error) {
        console.error(error)
      }
    }
  }
  async write({ inputValue, nodeId, datatype }) {
    if (this.connected) {
      let opcuaDataType
      let value
      if (datatype === 'BOOLEAN') {
        opcuaDataType = DataType.Boolean
        value = inputValue + '' === 'true'
      } else if (datatype === 'FLOAT') {
        opcuaDataType = DataType.Float
        value = parseFloat(value)
      } else if (datatype === 'INT32') {
        opcuaDataType = DataType.Int32
        value = parseInt(value)
      } else {
        opcuaDataType = DataType.String
        value = inputValue
      }
      await this.session
        .writeSingleNode(nodeId, { value, opcuaDataType })
        .catch((error) => logger.error(error))
    }
  }
}

module.exports = Opcua