'use strict'

function register (server) {
  server.route({
    method: 'GET',
    path: '/test',
    handler: () => 'test response'
  })
}

exports.plugin = {
  name: 'testPlugin',
  version: '1.0.0',
  register
}
