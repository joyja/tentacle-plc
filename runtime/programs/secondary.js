function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function ({ global }) {
  await sleep(100)
  global.countSecondary = global.countSecondary + 1
}