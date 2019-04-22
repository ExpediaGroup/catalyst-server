# @vrbo/catalyst-server
[![NPM Version](https://img.shields.io/npm/v/@vrbo/catalyst-server.svg?style=flat-square)](https://www.npmjs.com/package/@vrbo/catalyst-server)
[![Build Status](https://travis-ci.org/homeaway/catalyst-server.svg?branch=master)](https://travis-ci.org/homeaway/catalyst-server)
[![Dependency Status](https://david-dm.org/homeaway/catalyst-server.svg?theme=shields.io)](https://david-dm.org/homeaway/catalyst-server)
[![NPM Downloads](https://img.shields.io/npm/dm/@vrbo/catalyst-server.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@vrbo/catalyst-server)

*   [Introduction](#introduction)
*   [Usage](#usage)
*   [Configuration and Composition](#configuration-and-composition)
    *   [Basic](#basic)
    *   [Environment Aware](#environment-aware)
    *   [Advanced](#advanced)
*   [Further Reading](#further-reading)

## Introduction
Catalyst-server is a configuration and composition management tool for Hapi.js applications. It allows for composition and configuration that is environment aware and extensible for a web application. This is managed from a single `manifest.json` file. The server also will include sensible defaults and implementations  (like [hapi-pino](https://github.com/pinojs/hapi-pino) for logging and [crumb](https://github.com/hapijs/crumb) for CSRF).

## Usage

1. Install hapi and catalyst-server `npm i @vrbo/catalyst-server hapi` into an empty node project
2. Create an `index.js` file for starting your server (example below).
3. Create a `manifest.json` for composition and configuration (example below).
4. Start your app `node index.js`

#### index.js
```javascript
const Catalyst = require('@vrbo/catalyst-server');
const Path = require('path');

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

#### manifest.json
```js
{
     // server configuration and application context variables.
    "server": {
        "app": {
        }
    },
    // Hapi plugins
    "register": {
    }
}
```

## Configuration and Composition

Catalyst-server uses [steerage](https://github.com/tlivings/steerage) to configure and compose your application.  It is environment aware and has some configuration protocols to resolve paths, read environment variables, import other JSON files, and more.

### Basic

At its core, catalyst-server loads a `manifest.json` to initial and start a Hapi.js server.  This file has a section for application configuration and composition via registering plugins.

Below is a basic example of a `manifest.json` file:

#### Basic manifest.json

```js
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
        "Inert": {
            "register": "require:inert"
        },
        "Vision": {
            "register": "require:vision",
            "options": {
                "engines": {
                    "html": "require:handlebars"
                },
                "path": "path:./templates"
            }
        }
    }
}
```

For the configuration you can access the values in the `server/app` section from inside your code from the the `server.app.config` object.  So the code to retrieve the example values look like this:

```javascript
const urlPrefix = server.app.config.get('urlPrefix');
const siteTitle = server.app.config.get('siteTitle');
```

The `register` block registers the plugins referenced.  In this example it is using [shortstop](https://github.com/krakenjs/shortstop) to resolve node modules using `require:[module]` and resolve paths using `path:[file_path]`.

Catalyst-server comes with the following short-stop resolvers:

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

Steerage also uses [confidence](https://github.com/hapijs/confidence) to give you the ability to build environmentally aware servers. See the example `manifest.json` file below.

#### Environment based manifest.json

```js
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
            "register": "require:crumb",
            "options": {
                "cookieOptions": {
                    "isSecure": {
                        "$filter": "env.NODE_ENV",
                        "development": false,
                        "$default": true
                    }
                },
                "restful": true
            }
        }
    }
}
```

Here you can see the `$filter` and `$default` fields.  These fields allow for filtering on a resolver like `env.NODE_ENV`. The `$filter` field evaluates the environment variable `NODE_ENV`. Then it will look to the following fields for a match in the keys for that value, otherwise the `$default` value is used. So the configuration values and options for plugins will change based on the environment variable `NODE_ENV`. You could also determine whether plugin should be registered at all. See the code below for an example based on this `manifest.json` file.

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

### Advanced

Here are some examples of the short-stop resolvers available that makes handling complex configuration and composition rather straight forward.

#### `file:` Reading a file into a value.
```json
    "key": "file:./pgp_pub.key"
```
* loads the file `pgp_pub.key` and will set the value `key` to the contents of that file.

#### `path:` Resolve a path.
```json
    "path": "path:./templates"
```
* will resolve the path of `./templates` and will set the value `path` to the fully resolved path.

#### `base64:` Resolve a base64 string.
```json
    "bytes": "base64:SGVsbG8="
```
* will decode the base64 string `SGVsbG8=` and will set the `bytes` value to a buffer from the base64 string.

#### `env:` Access an environment variable.
```json
    "dbHost": "env:PG_HOST"
```
* will evaluate the environment variable `PG_HOST` and will set the `dbHost` value to the environment variable value.

#### `require:` Require a javascript or json file.
```json
    "register": "require:inert"
```
* will load the node module `inert` and will set the `register` to what that module exports. This works for js files in you application.

#### `exec:` Execute a function in a file.
```json
    "status": "exec:./callStatus#get"
```
* will load the file `callStatus.js` and will run the exported function `get` and whatever value is return will be set for the `status` value.

#### `glob:` Match files using the patterns shell uses.
```json
    "files": "glob:./assets/**/*.js"
```
* will use [glob](https://github.com/isaacs/node-glob) to evaluate `./assets/**/*.js` and sets the value of `files` to an array of files that match the glob string.

#### `import:` Imports another JSON file, supports comments.
```json
    "data": "import:./data/salt.json"
```
* will load a json file `./data/salt.json`, evaluate it (ignoring comments) and set `data` to that value.

#### `eval:` Safely execute a string as javascript code.
```json
    "start": "eval:new Date().toISOString()"
```
* will use [vm](https://nodejs.org/api/vm.html) to evaluate the string and set the `start` to the current date time as an ISO string.

```js
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

* eval can also be used to reference other values in the `manifest`. In the above example the `child/value` in `server/app` will be set to `'abc_xyz'`.

## Example Code

See the [examples folder](examples) for an example.

## Further Reading

*   [License](LICENSE)
*   [Code of conduct](CODE_OF_CONDUCT.md)
*   [Contributing](CONTRIBUTING.md)
*   [Changelog](CHANGELOG.md)