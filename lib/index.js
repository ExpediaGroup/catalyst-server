/*
Copyright 2021 Expedia Group, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const Path = require('path')
const Hoek = require('@hapi/hoek')
const Handlers = require('shortstop-handlers')
const Steerage = require('@vrbo/steerage')
const evalHandler = require('./shortstop/eval')
const { manifestSchema, optionsSchema } = require('./schemas')
/**
 * init - creates a server from configuration.
 * @param {object} options - init options
 * @param {object} options.userConfigPath - path or array of paths to a manifest file
 * @param {object} options.baseDir - directory of the manifest file
 * @param {object} options.onConfig - hook for config loaded
 * @param {object} options.environment - the environment to use for criteria in config
 * @param {object} options.shortstopHandlers - addition shortstop handler to use in config
 */
const init = async function (options = {}) {
  let {
    userConfigPath,
    baseDir,
    onConfig,
    environment,
    shortstopHandlers,
    defaults,
    overrides
  } = await optionsSchema.validateAsync(options)

  const baseConfig = Path.join(__dirname, 'config.json')
  const baseConfigBaseDir = Path.dirname(baseConfig)

  shortstopHandlers = Hoek.applyToDefaults({
    eval: evalHandler,
    // Custom shortstop handler execBase: allows successful resolution
    // of catalyst-server base config.json plugin relative paths
    // by explicitly passing catalyst-server config
    // baseDir so that any user provided baseDir override does not cause
    // require resolution issues during initialization.
    execBase: Handlers.exec(baseConfigBaseDir)
  }, shortstopHandlers)

  if (userConfigPath.length) {
    // call the use supplied config hook within our own below
    const userOnConfigHook = onConfig

    onConfig = async function (config) {
      await manifestSchema.validateAsync(config.data)

      if (userOnConfigHook) {
        config = await userOnConfigHook(config)
      }

      return config
    }
  }

  const server = await Steerage.init({
    basedir: baseDir,
    config: [
      baseConfig,
      ...userConfigPath
    ],
    environment,
    onconfig: onConfig,
    protocols: shortstopHandlers,
    defaults,
    overrides
  })

  // shutdown gracefully
  /* istanbul ignore next */
  function end () {
    server.stop()
      .then(() => {
        process.exit(0)
      })
      .catch(() => {
        process.exit(1)
      })
  }

  /* istanbul ignore next */
  process.once('SIGINT', end)
  /* istanbul ignore next */
  process.once('SIGTERM', end)

  return server
}

module.exports = { init }
