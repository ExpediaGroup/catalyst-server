/* eslint-env mocha */

'use strict'

const { assert } = require('chai')

describe('Schemas', () => {
  it('should include manifestSchema', () => {
    const { manifestSchema, optionsSchema } = require('../../lib/schemas')
    assert.ok(manifestSchema, 'Can create an instance of manifestSchema')
    assert.ok(optionsSchema, 'Can create an instance of optionsSchema')
  })
})
