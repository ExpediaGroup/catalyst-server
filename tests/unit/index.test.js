'use strict'

const Path = require('path')
const Chai = require('chai')
const ChaiAsPromised = require('chai-as-promised')
const Catalyst = require('../../lib')

const { expect } = Chai
Chai.use(ChaiAsPromised)

describe('Catalyst', () => {
  it('should register the default plugins', async () => {
    const defaultPlugins = [
      'steerage',
      'crumb',
      'hapi-pino'
    ]
    const server = await Catalyst.init()
    const registeredPluginNames = Object.keys(server.registrations)

    expect(registeredPluginNames).to.include.members(defaultPlugins)

    await server.stop()
  })

  it('should load a plugin from a manifest', async () => {
    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest.json')
    })

    const response = await server.inject('/test')
    expect(response.result).to.equal('test response')

    await server.stop()
  })

  it('should override the default port', async () => {
    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-port3000.json')
    })

    expect(server.info.port).to.equal(3000)

    await server.stop()
  })

  it('should allow baseDir to be altered', async () => {
    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-basedir.json'),
      baseDir: Path.join(__dirname, '..', 'fixtures', 'basedir')
    })

    const response = await server.inject('/testbasedir')
    expect(response.result).to.equal('test response')

    await server.stop()
  })

  it('should allow for disabling a default plugin', async () => {
    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-disable-hapi-pino.json')
    })

    expect(server.registrations['hapi-pino']).to.be.an('undefined')

    await server.stop()
  })

  it('should parse invalid cookies', async () => {
    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest.json')
    })

    const response = await server.inject({
      method: 'GET',
      url: '/test',
      headers: {
        cookie: 'a=x y;'
      }
    })

    expect(response.statusCode).to.equal(200)

    await server.stop()
  })

  it('should work as expected with the confidence module', async () => {
    const origNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const prodPlugins = ['steerage', 'crumb', 'testPlugin']

    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures', 'manifest-confidence.json')
    })

    // verify that the default plugins were not overwritten
    const registeredPluginNames = Object.keys(server.registrations)
    expect(registeredPluginNames).to.include.members(prodPlugins)
    expect(registeredPluginNames).to.not.include('hapi-pino')

    const response = await server.inject('/test')

    expect(response.result).to.equal('test response')

    await server.stop()

    process.env.NODE_ENV = origNodeEnv
  })

  describe('lifecycle hooks', () => {
    it('should be able to change connection configuration', async () => {
      const server = await Catalyst.init({
        userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest.json'),
        onConfig (defaults) {
          defaults.set('server.port', 9000)
          return defaults
        }
      })

      expect(server.info.port).to.equal(9000)

      await server.stop()
    })

    it('should be able to change plugins prior to registration', async () => {
      const server = await Catalyst.init({
        userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest.json'),
        onConfig (defaults) {
          defaults.set('register.test-plugin.plugin.plugin.version', '2.0.0')
          return defaults
        }
      })

      expect(server.registrations.testPlugin.version).to.equal('2.0.0')

      await server.stop()
    })

    it('should be able to change the manifest', async () => {
      const server = await Catalyst.init({
        userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest.json'),
        onConfig (defaults) {
          defaults.set('server.router.stripTrailingSlash', false)
          return defaults
        }
      })

      expect(server.settings.router.stripTrailingSlash).to.equal(false)

      const response = await server.inject('/test')

      expect(response.result).to.equal('test response')

      await server.stop()
    })

    it('should reject if a lifecycle hook returns an error', () => {
      const promise = Catalyst.init({
        userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest.json'),
        onConfig (defaults) {
          throw new Error('Bad hook')
          return defaults // eslint-disable-line no-unreachable
        }
      })

      return expect(promise).to.be.rejectedWith(Error)
    })

    it('should support `eval` protocol', async () => {
      const server = await Catalyst.init({
        userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-eval.json'),
        onConfig (defaults) {
          expect(defaults.get('server.app.eval')).to.equal('something')
          return defaults
        }
      })

      await server.stop()
    })

    it('should support additional user-provided shortstop protocols', async () => {
      const server = await Catalyst.init({
        userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-customprotocol.json'),
        onConfig (defaults) {
          expect(defaults.get('server.app.custom')).to.equal('SOMETHING')
          return defaults
        },
        shortstopHandlers: {
          custom (v) {
            return v.toUpperCase()
          }
        }
      })

      await server.stop()
    })

    it('should reject if manifest does not conform to schema', () => {
      const promise = Catalyst.init({
        userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-schema.json')
      })

      return expect(promise).to.be.rejectedWith(Error)
    })

    it('should reject if plugin options do not conform to schema', () => {
      const promise = Catalyst.init({
        fail: true
      })

      return expect(promise).to.be.rejectedWith(Error)
    })
  })
})
