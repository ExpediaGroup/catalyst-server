'use strict';
const split = require('split2')
const pump = require('pump')
const through = require('through2')
const args = require('args')
const sonic = require('sonic-boom')

/**
 * Set up more options passing at the node cli
 * node . | node my-transport-process.js --d="logs/log.log"
*/
args
  .option(['d','destination'], 'The port on which the app will be running')
 
const flagOptions = args.parse(process.argv);

let destination = flagOptions.destination;

if (!destination) throw new Error('destination is required');

const myTransport = through.obj(async function (chunk, enc, cb) {
  if(destination === 1 ){
    console.log(chunk)
  } else{
    let WriteTodestination =  sonic({
      dest: destination || 1,
      append: true,
      mkdir: true,
      sync: true // by default sonic will be async
    })

    WriteTodestination.write(JSON.stringify(chunk) + '\n')
  }
  cb()
})

return pump(process.stdin, split(JSON.parse), myTransport)