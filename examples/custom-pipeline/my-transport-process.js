'use strict';
const split = require('split2')
const pump = require('pump')
const through = require('through2')
const myTransport = through.obj(function (chunk, enc, cb) {
  console.log(chunk)
  cb()
})
pump(process.stdin, split(JSON.parse), myTransport)