# Catalyst server log configuration

## Pipe logs to the transport over custom pipeline input for production

Example below will take logs from the `process.stdin` and pipe to either `stdout`

my-transport-process.js
```
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
  .option(['d','destination'], 'The final destination for the logs')
 
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
```

Logs can now be consumed using shell piping:

```
node --max-http-header-size=32768 ./examples/custom-pipeline/index.js | node ./examples/custom-pipeline/my-transport-process.js -d=1
```
Or logs can be transport to a file:

```
node --max-http-header-size=32768 ./examples/custom-pipeline/index.js | node ./examples/custom-pipeline/my-transport-process.js -d="logs/log.log"
```