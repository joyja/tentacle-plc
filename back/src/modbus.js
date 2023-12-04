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
    } else {
      value = data
    }
    return value
  }
  formatOutput(value, format) {
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    let data = []
    if (format === `FLOAT`) {
      view.setFloat32(0, value)
      data.push(view.getUint16(this.reverseWords ? 2 : 0, this.reverseBits))
      data.push(view.getUint16(this.reverseWords ? 0 : 2, this.reverseBits))
    } else if (format === `INT32`) {
      view.setInt32(0, value)
      data.push(view.getUint16(this.reverseWords ? 0 : 2, !this.reverseBits))
      data.push(view.getUint16(this.reverseWords ? 2 : 0, !this.reverseBits))
    }
    return data
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
  async disconnect() {
    await new Promise((resolve) => {
      this.retryCount = 0
      this.retryInterval = clearInterval(this.retryInterval)
      console.log(
        `Disconnecting from modbus device, host: ${this.host}, port: ${this.port}.`
      )
      const logText = `Closed connection to modbus device, host: ${this.host}, port: ${this.port}.`
      if (this.connected) {
        this.client.close(() => {})
        console.log(logText)
        resolve()
      } else {
        console.log(logText)
        resolve()
      }
    })
    this.connected = false
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
            console.log(`Connection Timed Out on device: ${error.name}`)
            await this.disconnect()
            await this.connect()
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
            await this.disconnect()
            await this.connect()
          } else {
            console.error(error)
          }
        })
      } else if (registerType === 'COIL') {
        const quantity = 1
        return new Promise((resolve, reject) => {
          this.client.readCoils(register, quantity, (error, data) => {
            if (error) {
              reject(error)
              return
            }
            resolve(this.formatValue(data.data[0], format))
          })
        }).catch(async (error) => {
          if (error.name === 'TransactionTimedOutError') {
            await this.disconnect()
            await this.connect()
          } else {
            console.error(error)
          }
        })
      }
    }
  }
  async write({ value, registerType, register, format }) {
    if (this.connected) {
      if (registerType === 'HOLDING_REGISTER') {
        return new Promise((resolve, reject) => {
          this.client.writeRegisters(
            register,
            this.formatOutput(value, format),
            (error) => {
              if (error) {
                reject(error)
                return
              }
              resolve()
            }
          )
        }).catch(async (error) => {
          if (error.name === 'TransactionTimedOutError') {
            await this.disconnect()
            await this.connect()
          } else {
            throw error
          }
        })
      } else if (registerType === 'COIL') {
        return new Promise((resolve, reject) => {
          if (Object.prototype.toString.call(value) == '[object Array]') {
            this.client.writeCoils(
              register,
              value.map((item) => item + '' === 'true'),
              (error) => {
                if (error) {
                  reject(error)
                  return
                }
                resolve()
              }
            )
          } else {
            this.client.writeCoil(
              (register, value + '' === 'true'),
              (error) => {
                if (error) {
                  reject(error)
                  return
                }
                resolve()
              }
            )
          }
        }).catch(async (error) => {
          if (error.name === 'TransactionTimedOutError') {
            await this.disconnect()
            await this.connect()
          } else {
            throw error
          }
        })
      }
    }
  }
}

module.exports = Modbus
