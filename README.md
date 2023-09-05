![Node.js Version](https://img.shields.io/badge/node->=14.0.0-brightgreen.svg?longCache=true&style=flat&logo=node.js)
![NPM Version](https://img.shields.io/badge/npm->=6.0.0-brightgreen.svg?longCache=true&style=flat&logo=npm)
[![NPM Downloads](https://img.shields.io/npm/dm/@vrbo/catalyst-server.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@vrbo/catalyst-server)

# :warning: **Deprecation Notice** :warning:
This package is now deprecated and will not receive any updates in the future.

# @vrbo/catalyst-server

* [Introduction](#introduction)
* [Usage](#usage)
* [Configuration and Composition](#configuration-and-composition)
  * [Basic](#basic)
  * [Environment Aware](#environment-aware)
  * [Advanced](#advanced)
* [Further Reading](#further-reading)

## Introduction
Catalyst-server is a configuration and composition management tool for Hapi.js applications. It allows for composition and configuration that is environment aware and extensible for a web application. This is managed from one or more `manifest.json` files. The `userConfigPath` accepts a string that is a path to a single `manifest.json` file, or an array of path strings to support merging multiple manifest files. Duplicate keys in configuration files will be overwritten upon merging. If an array is passed, values of the config file that is the last index of `userConfigPath` takes precedence when merging, otherwise values from the single config file passed to `userConfigPath` takes precedence. The server also will include sensible defaults and implementations  (like [hapi-pino](https://github.com/pinojs/hapi-pino) for logging and [crumb](https://github.com/hapijs/crumb) for CSRF)

## Usage

1. Install catalyst-server and hapi into an empty node project with `npm i @vrbo/catalyst-server @hapi/hapi`
2. Create an `index.js` file for starting your server (example below).
3. Create a `manifest.json` for composition and configuration (example below).
4. Start your app `node index.js`

#### index.js
```javascript
const Catalyst = require('@vrbo/catalyst-server');
const Path = require('path');

// Init a new Catalyst server, and pass the path to your manifest file to the userConfigPath option to compose your app plugins
async function start(options = {}) {
    const server = await Catalyst.init({
        ...options,
        userConfigPath: Path.resolve(__dirname, 'manifest.json')
    });

    await server.start();

    server.log(['info'], `server running: ${server.info.uri}`);

    return server;
}

start();
```

```javascript
// Alternatively, pass an array of paths to compose your app plugins from separate manifest files.
const server = await Catalyst.init({
    userConfigPath: [
        path.resolve(__dirname, 'manifest.json'),
        path.resolve(__dirname, '/external/manifest.json')
    ]
});
```

#### manifest.json
```json5
{
     // server configuration and application context variables.
    "server": {
        "app": {}
    },
    // Hapi plugins
    "register": {},
    // Hapi routes
    "routes": []
}
```

## `Catalyst.init()` Options

- `userConfigPath` - Path to the json configuration file (see examples).
- `onConfig` - Hook for modifying config prior to creating list of plugins to register (can be async). `(config) => {return config;}`
- `defaults` - default pre-resolved configuration values. Can be an object or a path to a json file.
- `overrides` - optional override pre-resolved configuration values. Can be an object or a path to a json file.
- `baseDir` - Alternative location to base [shortstop](https://github.com/krakenjs/shortstop) relative paths from.
- `environment` - Additional criteria for [confidence](https://github.com/hapijs/confidence) property resolution and defaults to `{ env: process.env }`.
- `shortstopHandlers` - Object for additional shortstop handlers.
- `enableShutdownListeners` - Flag indicator for enabling or disabling execution of shutdown listeners, default 'true'

## Configuration and Composition

Catalyst-server uses [`@vrbo/steerage`](https://github.com/expediagroup/steerage) to configure and compose your application.  It is environment aware and has some configuration protocols to resolve paths, read environment variables, import other JSON files, and more.

### Basic example

At its core, `catalyst-server` loads a `manifest.json` file to initialize and start up a Hapi.js server.  This file has a section for application configuration and composition via registering plugins.

Below is a basic example of a `manifest.json` file:

#### manifest.json

```json5
{
     // server configuration and application context variables.
    "server": {
        "app": {
            "urlPrefix": "temp/",
            "siteTitle": "temp site"
        }
    },
    // Hapi plugins
    "register": {
        "inert": {
            "plugin": "require:@hapi/inert"
        },
        "vision": {
            "plugin": "require:@hapi/vision",
            "options": {
                "engines": {
                    "html": "require:handlebars"
                },
                "path": "path:./templates"
            }
        }
    },
    // Hapi routes
    "routes": [
        {
            "method": "GET",
            "path": "/my-file.txt",
            "handler": {
                "file": "path:./my-file.txt"
            }
        }
    ]
}
```

You can access all the configuration values in your code from the `server.app.config` object.  So the code to retrieve the example values looks like this:

```javascript
const urlPrefix = server.app.config.get('urlPrefix');
const siteTitle = server.app.config.get('siteTitle');
```

The `register` block registers the plugins referenced. In this example, it is using [shortstop](https://github.com/krakenjs/shortstop) to resolve node modules using `require:[module]` and resolve paths using `path:[file_path]`.

Catalyst-server ships with the following `shortstop` resolvers by default:

* __file__ - read a file.
* __path__ - resolve a path.
* __base64__ - resolve a base64 string.
* __env__ - access an environment variable.
* __require__ - require a javascript or json file.
* __exec__ - execute a function in a file.
* __glob__ - match files using the patterns shell uses.
* __import__ - imports another JSON file, supports comments.
* __eval__ - safely execute a string as javascript code.

### Environment Aware

`@vrbo/steerage` uses [`confidence`](https://github.com/hapijs/confidence) to give you the ability to build environmentally aware servers. See the example `manifest.json` file below.

#### Environment based manifest.json

```json5
{
     // server configuration and application context variables.
    "server": {
        "app": {
            "urlPrefix": {
                "$filter": "env.NODE_ENV",
                "production":"/application",
                "$default":"/temp"
            }
        }
    },
    // Hapi plugins
    "register": {
        "crumb": {
            "plugin": "require:crumb",
            "options": {
                "cookieOptions": {
                    "isSecure": {
                        "$filter": "env.NODE_ENV",
                        "production": true,
                        "$default": false
                    }
                },
                "restful": true
            }
        }
    }
}
```

In this example, the `$filter` and `$default` fields allow for filtering based on a resolver like `env.NODE_ENV`.

The `$filter` field evaluates the environment variable `NODE_ENV`. Then, it will look to the following fields for a match in the keys for that value. Otherwise, the `$default` value is used. So the configuration values and options for plugins will change based on the environment variable `NODE_ENV`.

This is what the above manifest configuration will return in code for different environments:

```javascript
// ENVIRONMENT VARIABLE NODE_ENV='development'
const urlPrefix = server.app.config.get('urlPrefix');
// returns '/temp'
// crumb will NOT use secure cookies.

// ENVIRONMENT VARIABLE NODE_ENV='production'
const urlPrefix = server.app.config.get('urlPrefix');
// returns '/application'
// crumb WILL use secure cookies.
```

Using a filter, you can easily enable/disable a plugin for a given environment. See the code below for an example, where we disable `hapi-pino` in development mode, and enable it in all other environments:

```json
{
    "register": {
        "hapi-pino": {
            "enabled": {
                "$filter": "env.NODE_ENV",
                "production": true,
                "$default": false
            }
        }
    }
}
```

### Advanced

Here are some examples of the `shortstop` resolvers which make handling complex configuration and composition rather straight forward.

#### `file:` Reading a file into a value.
* loads the file `pgp_pub.key` and will set the value `key` to the contents of that file.
  ```json
  {
      "key": "file:./pgp_pub.key"
  }
  ```

#### `path:` Resolve a path.
* will resolve the path of `./templates` and will set the value `path` to the fully resolved path.
  ```json
  {
      "path": "path:./templates"
  }
  ```

#### `base64:` Resolve a base64 string.
* will decode the base64 string `SGVsbG8=` and will set the `bytes` value to a buffer from the base64 string.
  ```json
  {
      "bytes": "base64:SGVsbG8="
  }
  ```

#### `env:` Access an environment variable.
* will evaluate the environment variable `PG_HOST` and will set the `dbHost` value to the environment variable value.
  ```json
  {
      "dbHost": "env:PG_HOST"
  }
  ```

#### `require:` Require a javascript or json file.
* will load the node module `inert` and will set the `register` to what that module exports. This works for js files in you application.
  ```json
  {
      "plugin": "require:@hapi/inert"
  }
  ```

#### `exec:` Execute a function in a file.
* will load the file `callStatus.js` and will run the exported function `get` and whatever value is return will be set for the `status` value.
  ```json
  {
      "status": "exec:./callStatus#get"
  }
  ```

#### `glob:` Match files using the patterns shell uses.
* will use [glob](https://github.com/isaacs/node-glob) to evaluate `./assets/**/*.js` and sets the value of `files` to an array of files that match the glob string.
  ```json
  {
      "files": "glob:./assets/**/*.js"
  }
  ```

#### `import:` Imports another JSON file, supports comments.
* will load a json file `./data/salt.json`, evaluate it (ignoring comments) and set `data` to that value.
  ```json
  {
      "data": "import:./data/salt.json"
  }
  ```

#### `eval:` Safely execute a string as javascript code.
* will use [vm](https://nodejs.org/api/vm.html) to evaluate the string and set the `start` to the current date time as an ISO string.
  ```json
  {
      "start": "eval:new Date().toISOString()"
  }
  ```

* `eval` can also be used to reference other values in the `manifest`. In the above example the `child/value` in `server/app` will be set to `'abc_xyz'`.
  ```json5
  {
      "server": {
          "app":{
              "first": "abc",
              "second": "xyz",
              "child": {
                  "value":"eval:${server.app.first}_${server.app.second}"
              }
          }
      }
  }
  ```


## Example Code

See the [examples](examples) folder for example code.

## Further Reading

* [License](LICENSE)
* [Code of conduct](CODE_OF_CONDUCT.md)
* [Contributing](CONTRIBUTING.md)
* [Changelog](CHANGELOG.md)
