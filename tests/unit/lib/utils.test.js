const Test = require('tape')

Test('[UNIT] lib/utils.js', (t) => {
  t.plan(7)
  const utils = require('../../../lib/utils')
  t.ok(utils, 'Can create an instance of utils')
  t.equal(typeof utils.resolvePort, 'function', 'Utils has resolvePort function.')
  t.equal(typeof utils.resolveHost, 'function', 'Utils has resolveHost function.')

  const port = process.env.NODE_PORT
  const hostname = process.env.HOSTNAME

  delete process.env.NODE_PORT
  delete process.env.HOSTNAME

  t.equal(utils.resolveHost(), '0.0.0.0', 'default 0.0.0.0 host')
  t.equal(utils.resolvePort(), 8080, 'default 8080 port')

  process.env.NODE_PORT = 80
  process.env.HOSTNAME = 'abc'

  t.equal(utils.resolveHost(), 'abc', 'override abc host')
  t.equal(utils.resolvePort(), 80, 'override 80 port')

  process.env.NODE_PORT = port
  process.env.HOSTNAME = hostname
})
