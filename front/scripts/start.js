#!/usr/bin/env node
const { start, build } = require('../server')

const main = async () => {
  await build(true)
  await start()
}

main()
