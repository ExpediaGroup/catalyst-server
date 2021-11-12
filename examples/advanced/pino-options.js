const Pino = require('pino');

const transport = Pino.transport({
targets: [
    {
        level: 'info',
        target: 'pino-pretty',
        options: {
            singleLine: true,
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
            destination: 'logs/.error.log'
        }
    }
]
});

module.exports = Pino(JSON.stringify(transport));