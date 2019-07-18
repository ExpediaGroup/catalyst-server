'use strict'

function register (server) {
  server.route({
    method: 'GET',
    path: '/testbasedir',
    handler: () => 'test response'
  })
}

exports.plugin = {
  name: 'basedirTestPlugin',
  version: '1.0.0',
  register
}
