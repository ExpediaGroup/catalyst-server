# Catalyst server log configuration

## Pipe logs to the transport over custom pipeline input for production

Example below will take logs from the `process.stdin` and pipe to either `stdout`

my-transport-process.js
```
'use strict';
const split = require('split2')
const pump = require('pump')
const through = require('through2')
const myTransport = through.obj(function (chunk, enc, cb) {
  console.log(chunk)
  cb()
})
pump(process.stdin, split(JSON.parse), myTransport)
```

Logs can now be consumed using shell piping:

```
node --max-http-header-size=32768 ./examples/custom-pipeline/index.js | node ./examples/custom-pipeline/my-transport-process.js -d=1
```
Or logs can be transport to a file:

```
node --max-http-header-size=32768 ./examples/custom-pipeline/index.js | node ./examples/custom-pipeline/my-transport-process.js -d="logs/log.log"
```