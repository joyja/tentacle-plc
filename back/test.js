const Modbus = require('./src/modbus')

const modbus = new Modbus({
  ...{
    host: '192.168.50.200',
    port: 502,
    unitId: 0,
    reverseBits: false,
    reverseWords: false,
    zeroBased: false,
    retryRate: 5000,
  },
  global: this.global,
})
modbus.connect()

let red = true

setInterval(async () => {
  red = !red
  await modbus
    .write({
      value: [red],
      ...{
        register: 0,
        registerType: 'COIL',
        format: 'BOOLEAN',
      },
    })
    .catch((error) => {
      console.error(error)
    })
  await modbus.write({
    value: [!red],
    ...{
      register: 1,
      registerType: 'COIL',
      format: 'BOOLEAN',
    },
  })
}, 100)
