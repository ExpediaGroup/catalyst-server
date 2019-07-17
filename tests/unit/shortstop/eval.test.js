'use strict'

const { expect } = require('chai')

describe('Shortstop handlers', () => {
  describe('eval', () => {
    const evalHandler = require('../../../lib/shortstop/eval')

    it('should evaluate expressions correctly', () => {
      const result = evalHandler('$' + '{1 + 1}')
      expect(result).to.equal('2')
    })
  })
})
