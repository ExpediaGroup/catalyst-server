'use strict'

function register (server) {
  server.route({
    method: 'GET',
    path: '/test-external-basedir',
    handler: () => 'test response external basedir'
  })
}

exports.plugin = {
  name: 'baseDirTestPluginExternal',
  version: '1.0.0',
  register
}
