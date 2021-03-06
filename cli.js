#!/usr/bin/env node
const path = require('path')
const sao = require('sao')

const generator = path.resolve(__dirname, './')
// In a custom directory or current directory
const outDir = process.argv[3] === 'project' || process.argv[3] === 'p' 
? path.resolve('nuxt/' + process.argv[2] || '.')
: path.resolve('nuxt/modules/' + process.argv[2] || '.')

console.log(`> Generating Nuxt.js project in ${outDir}`)

// See https://sao.js.org/#/advanced/standalone-cli
sao({ generator, outDir, logLevel: 2 })
  .run()
  .catch((err) => {
    console.trace(err)
    process.exit(1)
  })
