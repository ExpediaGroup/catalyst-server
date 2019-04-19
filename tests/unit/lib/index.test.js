const Test = require('tape')

Test('[UNIT] lib/index.js', (t) => {
  t.plan(1)
  const lib = require('../../../lib')
  t.ok(lib, 'Can create an instance of lib')
})
