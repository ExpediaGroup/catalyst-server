/**
 * After running this example code with node,
 * you can see the results in browser at:
 * http://localhost:8080/items
 */

const Catalyst = require('../..');
const Pino = require('pino');
const HapiPino = require('hapi-pino');
const Path = require('path');
const getResponse = [
  {string: 'string1', number: 1, boolean: true},
  {string: 'string2', number: 2, boolean: false},
];

async function start (options = {}) {
  const server = await Catalyst.init({
    ...options,
    userConfigPath: Path.resolve(__dirname, 'manifest.json'),
  });

  server.route({
    path: '/items',
    method: 'GET',
    options: {
      log: { collect: true },
      cache: { expiresIn: 5000 },
    },
    handler: async function (req, h) {
      // you can also use a pino instance, which will be faster
      req.logger.info('GET_items', getResponse);
      return await h.response(getResponse);
    },
  });

  const transport = Pino.transport({
    targets: [
        {
            level: 'info',
            target: 'pino-pretty',
            options: {
                singleLine: false,
                ignorePaths: ['/favicon.ico'],
                logRequestComplete: false,
                append: true,
                mkdir: true,
                destination: 'logs/.info.log'
            }
        },
        {
            level: 'error',
            target: 'pino-pretty',
            options: {
                singleLine: false,
                ignorePaths: ['/favicon.ico'],
                logRequestComplete: false,
                append: true,
                mkdir: true,
                destination: 'logs/.error.log'
            }
        },
        {
            level: 'warn',
            target: 'pino-pretty',
            options: {
                singleLine: false,
                ignorePaths: ['/favicon.ico'],
                logRequestComplete: false,
                append: true,
                mkdir: true,
                destination: 'logs/.warn.log'
            }
        }]
});

await server.register({
    plugin: HapiPino,
    options: {
        instance: Pino(transport),
        mergeHapiLogData: false,
        ignorePaths: ['/favicon.ico'],
        ignoredEventTags: { log: ['client'], request: '*' },
    }
});
  
  await server.start()
  server.log(['info'], `items endpoint : ${server.info.uri}/items`)
  return server
}

start()
