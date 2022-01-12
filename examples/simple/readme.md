# Catalyst server logs configuration

The follow diagram explain how our catalyst server manage the logs

![threads-diagram drawio](https://user-images.githubusercontent.com/88118994/149195822-de5d33ad-f29f-48ff-840b-ce2fb41eb08a.png)

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
node --max-http-header-size=32768 . | pino-pretty --config=.pino-prettyrc
```

.pino-pretty pass the [CLI Arguments](https://github.com/pinojs/pino-pretty#cli-arguments)



_node js profile review_

```
clinic doctor --autocannon [ /items ] -- node --max-http-header-size=32768 ./index | pino-pretty --config=.pino-prettyrc

```


