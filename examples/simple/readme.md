# Catalyst server log configuration

The follow diagram explains how our catalyst server manages logs

![threads-diagram drawio](https://user-images.githubusercontent.com/88118994/149195822-de5d33ad-f29f-48ff-840b-ce2fb41eb08a.png)

## [Pino-pretty](https://github.com/pinojs/pino-pretty) logs for development mode:

install pino-pretty as a development dependency.

` npm install --save-dev pino-pretty `

manifest.json
```
    "hapi-pino": {
        "plugin": "require:hapi-pino",
        "options": {
            "$filter": "env.NODE_ENV",
            "$default": {},
            "development": {
                "transport": {
                    "target": "pino-pretty",
                    "options": {
                        "colorize": true,
                        "translateTime": true
                    }
                }
            }      
        }
    }
```

pass the `NODE_ENV` as following:

```
NODE_ENV=development node ./examples/simple/index.js
```

## [Pino/file](https://github.com/pinojs/pino/blob/HEAD/docs/transports.md#pinofile) transport logs to stdout or file for production.

```
    "transport": {
        "targets": [
            {
                "target": "pino/file",
                "options": {
                    "destination": 1
                }
            }
        ]
    }
```

## node js profile review

```
clinic doctor --autocannon [ /items ] -- node --max-http-header-size=32768 ./examples/simple/index.js | ./node_modules/.bin/pino-pretty --config=./examples/simple/.pino-prettyrc

```


