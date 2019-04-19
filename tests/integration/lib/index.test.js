const Test = require('tape')

Test('[INTEGRATION] lib/index.js', async (t) => {
  t.plan(1)

  const Catalyst = require('../../../lib')
  process.env.NODE_ENV = 'test'
  t.ok(Catalyst, 'Can create an instance of catalyst-server')
})
