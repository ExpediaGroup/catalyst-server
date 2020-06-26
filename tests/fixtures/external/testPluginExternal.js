'use strict'

function register (server) {
  server.route({
    method: 'GET',
    path: '/test-external',
    handler: () => 'test response external'
  })
}

exports.plugin = {
  name: 'testPluginExternal',
  version: '1.0.0',
  register
}
