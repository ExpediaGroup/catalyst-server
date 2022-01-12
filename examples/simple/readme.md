# Catalyst server logs configuration

The follow diagram explain how our catalyst server manage the logs

## [Pino-pretty](https://github.com/pinojs/pino-pretty) logs for development mode:

install pino-pretty as a development dependency.

` npm install -D pino-pretty `

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

## [Pino-pretty](https://github.com/pinojs/pino/blob/master/docs/pretty.md) logs for production mode(legacy transport):

Install Pino-pretty globally

`npm install -g pino-pretty`

It is recommended to use pino-pretty with pino by piping output to the CLI tool:

```
node . | pino-pretty --config=.pino-prettyrc
```

.pino-pretty pass the [CLI Arguments](https://github.com/pinojs/pino-pretty#cli-arguments)



