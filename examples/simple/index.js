/**
 * After running this example code with node,
 * you can see the results in browser at:
 * http://localhost:8080/hello
 */

const Catalyst = require('../..')
const Path = require('path')

async function start (options = {}) {
  const server = await Catalyst.init({
    ...options,
    userConfigPath: Path.resolve(__dirname, 'manifest.json')
  })
  server.route({
    path: '/hello',
    method: 'GET',
    handler () {
      return 'hello'
    }
  })
  await server.start()
  server.log(['info'], `server running: ${server.info.uri}`)
  return server
}

start()
