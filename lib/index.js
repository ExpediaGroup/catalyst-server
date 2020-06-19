/*
Copyright 2019 Expedia Group, Inc.

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
const Determination = require('@vrbo/determination')
const Steerage = require('@vrbo/steerage')
const evalHandler = require('./shortstop/eval')
const { manifestSchema, optionsSchema } = require('./schemas')

/**
 * init - creates a server from configuration.
 * @param {object} options - init options
 * @param {object} options.userConfigPath - path of the manifest file
 * @param {object} options.baseDir - directory of the manifest file
 * @param {object} options.onConfig - hook for config loaded
 * @param {object} options.environment - the environment to use for criteria in config
 * @param {object} options.shortstopHandlers - addition shortstop handler to use in config
 */
const init = async function (options = {}) {
  let {
    userConfigPath,
    baseDir = userConfigPath.length ? Path.dirname(userConfigPath[0]) : null,
    onConfig,
    environment,
    shortstopHandlers,
    protocols
  } = await optionsSchema.validateAsync(options)
  let allProtocols = [() => ({})]
  // options may contain a link to a user manifest. if it does, merge it with default configs
  if (userConfigPath) {
    allProtocols = [
      function protocols(currentBaseDir) {
        return Hoek.applyToDefaults({
          file: Handlers.file(baseDir),
          path: Handlers.path(baseDir),
          base64: Handlers.base64(),
          env: Handlers.env(),
          require: Handlers.require(baseDir),
          exec: Handlers.exec(baseDir),
          glob: Handlers.glob(baseDir),
          eval: evalHandler
        }, shortstopHandlers)
      },
      ...(protocols ? [protocols] : [])
    ];
    // const protocols = Hoek.applyToDefaults({
    //   file: Handlers.file(baseDir),
    //   path: Handlers.path(baseDir),
    //   base64: Handlers.base64(),
    //   env: Handlers.env(),
    //   require: Handlers.require(baseDir),
    //   exec: Handlers.exec(baseDir),
    //   glob: Handlers.glob(baseDir),
    //   eval: evalHandler
    // }, shortstopHandlers)

    // // resolver for user config
    // const resolver = Determination.create({
    //   config: userConfigPath,
    //   protocols,
    //   criteria: environment
    // })

    // // call the use supplied config hook within our own below
    // const userOnConfigHook = onConfig

    // // use the configuration hook in Steerage to merge the user config with default config
    // onConfig = async function (config) {
    //   const appConfig = await resolver.resolve()
    //   const validated = await manifestSchema.validateAsync(appConfig.data)

    //   config.merge(validated)

    //   if (userOnConfigHook) {
    //     config = await userOnConfigHook(config)
    //   }

    //   return config
    // }
  }

  const server = await Steerage.init({
    config: Path.join(__dirname, 'config.json'),
    onconfig: onConfig,
    userConfigPath: [...(userConfigPath.length ? [].concat(userConfigPath) : [])],
    environment,
    protocols: allProtocols
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
