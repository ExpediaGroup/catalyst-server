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

const Joi = require('joi')

// Set up default logs confg
const SonicBoom = require('sonic-boom')

const manifestSchema = Joi.object().keys({
  register: Joi.object(),
  server: Joi.object(),
  routes: Joi.array().items(Joi.object())
})

const defaults = {
  environment: { env: process.env },
  shortstopHandlers: {},
  logsDirectory: {
    logFolder: '',
    logFiles: [],
    mkdirLogs: mkdirLogs()
  }
}

const optionsSchema = Joi.object({
  baseDir: Joi.string(),
  environment: Joi.object().default(defaults.environment),
  onConfig: Joi.func(),
  shortstopHandlers: Joi.object().default(defaults.shortstopHandlers),
  userConfigPath: Joi.array().items(Joi.string()).single().default([]),
  logsFilesDirectory: Joi.object().default(defaults.logs)
}).default(defaults)

function mkdirLogs (logFiles = [], logsFolder = 'logs/') {
  logFiles = ['trace', 'debug', 'info', 'warn', 'error']
  logFiles.forEach(
    file => { SonicBoom({ dest: `${logsFolder}.${file}.log`, mkdir: true }) }
  )
}

module.exports = { manifestSchema, optionsSchema }
