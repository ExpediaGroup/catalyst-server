const Test = require('tape')

Test('[UNIT] lib/schemas.js', (t) => {
  t.plan(2)
  const { manifestSchema, optionsSchema } = require('../../../lib/schemas')
  t.ok(manifestSchema, 'Can create an instance of manifestSchema')
  t.ok(optionsSchema, 'Can create an instance of optionsSchema')
})
