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
      '@vrbo/steerage',
      '@hapi/crumb',
      'hapi-pino'
    ]
    const server = await Catalyst.init()
    const registeredPluginNames = Object.keys(server.registrations)

    expect(registeredPluginNames).to.include.members(defaultPlugins)
  })

  it('should override the default port', async () => {
    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-port3000.json')
    })

    expect(server.info.port).to.equal(3000)
  })

  it('should register provided routes', async () => {
    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-routes.json')
    })

    const response = await server.inject('/my-file.txt')
    expect(response.result).to.equal('hello-world')

    await server.stop()
  })

  describe('single manifest file passed to userConfigPath', () => {
    it('should load a plugin from a manifest', async () => {
      const server = await Catalyst.init({
        userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest.json')
      })

      const response = await server.inject('/test')
      expect(response.result).to.equal('test response')

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
  })

  describe('multiple manifest files passed as array to userConfigPath', () => {
    it('should load plugins from multiple manifest files', async () => {
      const server = await Catalyst.init({
        userConfigPath: [
          Path.join(__dirname, '..', 'fixtures/manifest.json'),
          Path.join(__dirname, '..', 'fixtures/external/manifest-external.json')
        ]
      })

      const response = await server.inject('/test')
      expect(response.result).to.equal('test response')

      const responseExternal = await server.inject('/test-external')
      expect(responseExternal.result).to.equal('test response external')

      await server.stop()
    })

    it('should allow baseDir to be altered', async () => {
      const server = await Catalyst.init({
        userConfigPath: [
          Path.join(__dirname, '..', 'fixtures/manifest-basedir.json'),
          Path.join(__dirname, '..', 'fixtures/external/manifest-external-basedir.json')
        ],
        baseDir: Path.join(__dirname, '..', 'fixtures', 'basedir')
      })

      const response = await server.inject('/testbasedir')
      expect(response.result).to.equal('test response')

      const responseExternal = await server.inject('/test-external-basedir')
      expect(responseExternal.result).to.equal('test response external basedir')

      await server.stop()
    })
  })

  xit('should allow for disabling a default plugin', async () => {
    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-disable-hapi-pino.json')
    })

    expect(server.registrations['hapi-pino']).to.be.an('undefined')
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
  })

  xit('should work as expected with the confidence module', async () => {
    const origNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const prodPlugins = ['@vrbo/steerage', '@hapi/crumb', 'testPlugin']

    const server = await Catalyst.init({
      userConfigPath: Path.join(__dirname, '..', 'fixtures', 'manifest-confidence.json')
    })

    // verify that the default plugins were not overwritten
    const registeredPluginNames = Object.keys(server.registrations)
    expect(registeredPluginNames).to.include.members(prodPlugins)
    expect(registeredPluginNames).to.not.include('hapi-pino')

    const response = await server.inject('/test')

    expect(response.result).to.equal('test response')

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
      await Catalyst.init({
        userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-eval.json'),
        onConfig (defaults) {
          expect(defaults.get('server.app.eval')).to.equal('something')
          return defaults
        }
      })
    })

    it('should support additional user-provided shortstop protocols', async () => {
      await Catalyst.init({
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
    })

    describe('single manifest file passed to userConfigPath', () => {
      it('should reject if manifest does not conform to schema', () => {
        const promise = Catalyst.init({
          userConfigPath: Path.join(__dirname, '..', 'fixtures/manifest-schema.json')
        })

        return expect(promise).to.be.rejectedWith(Error)
      })
    })

    describe('multiple manifest files passed as array to userConfigPath', () => {
      it('should reject if one or more manifest files do not conform to schema', () => {
        const promise = Catalyst.init({
          userConfigPath: [
            Path.join(__dirname, '..', 'fixtures/manifest.json'), // valid
            Path.join(__dirname, '..', 'fixtures/external/manifest-schema.json') // invalid
          ]
        })

        return expect(promise).to.be.rejectedWith(Error)
      })
    })

    it('should reject if plugin options do not conform to schema', () => {
      const promise = Catalyst.init({
        fail: true
      })

      return expect(promise).to.be.rejectedWith(Error)
    })
  })
})
