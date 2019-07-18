'use strict'

const { expect } = require('chai')
const Utils = require('../../lib/utils')

describe('Utils', () => {
  describe('#resolvePort', () => {
    const origNodePort = process.env.NODE_PORT

    afterEach(() => {
      process.env.NODE_PORT = origNodePort
    })

    it('should default to use `8080`', () => {
      expect(Utils.resolvePort()).to.equal('8080')
    })

    it('should use `process.env.NODE_PORT` when available', () => {
      process.env.NODE_PORT = '1234'
      expect(Utils.resolvePort()).to.equal('1234')
    })
  })

  describe('#resolveHost', () => {
    const origHostName = process.env.HOSTNAME

    afterEach(() => {
      process.env.HOSTNAME = origHostName
    })

    it('should default to use `0.0.0.0`', () => {
      expect(Utils.resolveHost()).to.equal('0.0.0.0')
    })

    it('should use `process.env.HOSTNAME` when available', () => {
      process.env.HOSTNAME = 'mylocalhost'
      expect(Utils.resolveHost()).to.equal('mylocalhost')
    })
  })
})
