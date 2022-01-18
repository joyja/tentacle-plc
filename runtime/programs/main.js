function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = async function ({ global }) {
  await sleep(100)
  global.count = global.count + 1
  // console.log(global.motor1)
  // console.log(`Main task has completed ${global.count} times.`)
}
