#!/usr/bin/env node
const path = require('path')
const { loadNuxt, build } = require('nuxt')

const main = async () => {
  const nuxt = await loadNuxt({
    rootDir: path.join(__dirname, '../'),
    for: 'build',
  })
  await build(nuxt)
}

main()
