const {
  DataType,
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  makeBrowsePath,
  NodeCrawler,
  AttributeIds
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
    const options = {
      applicationName,
      connectionStrategy: {
        initialDelay,
        maxRetry
      },
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpointMustExist: false,
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
        `Connecting to opcua device, host: ${this.host}, port: ${this.port}.`
      )
      await this.client
        .connect(`opc.tcp://${this.host}:${this.port}`)
        .catch((error) => {
          this.error = error.message
          this.connected = false
          if (!this.retryInterval) {
            this.retryInterval = setInterval(async () => {
              console.log(
                `Retrying connection to opcua device, retry attempts: ${this.retryCount}.`
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
          `Connected to opcua device, host: ${this.host}, port: ${this.port}.`
        )
        this.connected = true
        this.session = await this.client.createSession()
      } else {
        this.connected = false
        console.log(
          `Connection failed to opcua device, host: ${this.host}, port: ${this.port}, with error: ${this.error}.`
        )
      }
    }
  }
  async disconnect() {
    this.retryCount = 0
    this.retryInterval = clearInterval(this.retryInterval)
    console.log(`Disconnecting from modbus device`)
    const logText = `Closed connection to modbus device.`
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
          .catch((error) => console.error(error))
        return value
      } catch (error) {
        console.error(error)
      }
    }
  }
  async readMany({ nodeIds }) {
    if (this.connected) {
      try {
        const results = await this.session
          .read(nodeIds.map((nodeId) => {
            return {
              nodeId,
              attributeId: AttributeIds.value
            }
          }))
          .catch((error) => console.error(error))
        return results.map((result) => {
          return result.value.value
        })
      } catch (error) {
        console.error(error)
      }
    }
  }
  async write({ inputValue, nodeId, registerType }) {
    if (this.connected) {
      let opcuaDataType
      let value
      console.log(inputValue, nodeId, registerType)
      if (registerType === 'BOOLEAN') {
        opcuaDataType = DataType.Boolean
        value = inputValue + '' === 'true'
      } else if (registerType === 'FLOAT') {
        opcuaDataType = DataType.Float
        value = parseFloat(inputValue)
      } else if (registerType === 'DOUBLE') {
        opcuaDataType = DataType.Double
        value = parseFloat(inputValue)
      } else if (registerType === 'INT16') {
        opcuaDataType = DataType.Int16
        value = parseInt(inputValue)
      } else if (registerType === 'INT32') {
        opcuaDataType = DataType.Int32
        value = parseInt(inputValue)
      } else {
        opcuaDataType = DataType.String
        value = inputValue
      }
      await this.session
        .writeSingleNode(nodeId, { value, dataType: opcuaDataType })
        .catch((error) => console.error(error))
    }
  }
}

module.exports = Opcua