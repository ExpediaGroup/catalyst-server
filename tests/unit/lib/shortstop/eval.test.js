/* eslint-disable no-template-curly-in-string */
const Test = require('tape')

Test('[UNIT] lib/shortstop/eval', (t) => {
  t.plan(3)
  const evalHandler = require('../../../../lib/shortstop/eval')
  t.ok(evalHandler, 'Can create an instance of evalHandler')
  t.equal(typeof evalHandler, 'function', 'evalHandler is function.')

  const expression = '${1 + 1}'
  const result = evalHandler(expression)
  t.equal(result, '2', 'evalHandler works.')
})
