#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const { loadNuxt, build: nuxtBuild } = require('nuxt')

const build = async (ifNotExists = false) => {
  let skip = false
  if (ifNotExists) {
    skip = fs.existsSync(path.join(__dirname, '../', '.nuxt'))
  }
  if (!skip) {
    const nuxt = await loadNuxt({
      rootDir: path.join(__dirname, '../'),
      for: 'build',
    })
    await nuxtBuild(nuxt)
  }
}

const start = async () => {
  const nuxt = await loadNuxt({
    rootDir: path.join(__dirname, '../'),
    for: 'start',
  })
  await nuxt.listen(3000)
}

module.exports = {
  build,
  start,
}
