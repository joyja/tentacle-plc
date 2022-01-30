const ModbusClient = require('modbus-serial')

class Modbus {
  constructor({
    unitId = 0,
    host,
    port,
    reverseBits,
    reverseWords,
    zeroBased,
    retryRate,
  }) {
    this.host = host
    this.port = port
    this.reverseBits = reverseBits
    this.reverseWords = reverseWords
    this.zeroBased = zeroBased
    this.retryRate = retryRate
    this.connected = false
    this.error = null
    this.retryCount = 0
    this.client = new ModbusClient()
  }
  formatValue(data, format) {
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    let value = null
    if (format === `FLOAT`) {
      view.setUint16(0, this.reverseWords ? data[1] : data[0], this.reverseBits)
      view.setUint16(2, this.reverseWords ? data[0] : data[1], this.reverseBits)
      value = view.getFloat32(0)
    } else if (format === `INT32`) {
      view.setInt16(0, this.reverseWords ? data[1] : data[0], this.reverseBits)
      view.setInt16(2, this.reverseWords ? data[0] : data[1], this.reverseBits)
      value = view.getInt32(0)
    } else if (format === `INT16`) {
      view.setInt16(0, data[0], this.reverseBits)
      value = view.getInt16(0)
    }
    return value
  }
  async connect() {
    if (!this.connected) {
      this.error = null
      console.log(
        `Connecting to modbus device, host: ${this.host}, port: ${this.port}.`
      )
      await this.client
        .connectTCP(this.host, { port: this.port })
        .catch((error) => {
          this.error = error.message
          this.connected = false
          if (!this.retryInterval) {
            this.retryInterval = setInterval(async () => {
              console.log(
                `Retrying connection to modbus device, retry attempts: ${this.retryCount}.`
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
          `Connected to modbus device, host: ${this.host}, port: ${this.port}.`
        )
        this.connected = true
      } else {
        this.connected = false
        console.log(
          `Connection failed to modbus device, host: ${this.host}, port: ${this.port}, with error: ${this.error}.`
        )
      }
    }
  }
  async read({ registerType, register, format }) {
    if (this.connected) {
      if (registerType === 'INPUT_REGISTER') {
        const quantity = format === 'INT16' ? 1 : 2
        return new Promise((resolve, reject) => {
          this.client.readInputRegisters(
            !this.zeroBased ? register - 1 : register,
            quantity,
            async (error, data) => {
              if (error) {
                reject(error)
                return
              }
              resolve(this.formatValue(data.data, format))
            }
          )
        }).catch(async (error) => {
          if (
            error.name === 'TransactionTimedOutError' ||
            error.name === 'PortNotOpenError'
          ) {
            console.log(`Connection Timed Out on device`)
            await this.modbus.disconnect()
            await this.modbus.connect()
          } else {
            console.error(error)
          }
        })
      } else if (registerType === 'HOLDING_REGISTER') {
        const quantity = format === 'INT16' ? 1 : 2
        return new Promise((resolve, reject) => {
          this.client.readHoldingRegisters(
            register,
            quantity,
            (error, data) => {
              if (error) {
                reject(error)
                return
              }
              resolve(this.formatValue(data.data, format))
            }
          )
        }).catch(async (error) => {
          if (error.name === 'TransactionTimedOutError') {
            await this.modbus.disconnect()
            await this.modbus.connect()
          } else {
            console.error(error)
          }
        })
      } else {
      }
    }
  }
}

module.exports = Modbus
