const http = require('http');
const wsServer = require('./websocket/wsServer');
const periodics = require('./periodics');
const shutdown = require('./shutdown');
const logger = require('./logger');
const app = require('./app');

// todo: вынести в конфиг
const ALIVE_CHECK_INTERVAL = 60 * 1000; // 60 seconds
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const INACTIVITY_INTERVAL = 30 * 1000; // 30 seconds

const httpServer = http.createServer(app);
const websocketServer = wsServer.create(httpServer);

process.on('uncaughtException', logger.error.bind(logger));
process.once('SIGTERM', shutdown(httpServer));
process.once('SIGINT', shutdown(httpServer));

setInterval(periodics.checkAlive, ALIVE_CHECK_INTERVAL).unref();
setInterval(periodics.checkActivity(INACTIVITY_TIMEOUT), INACTIVITY_INTERVAL).unref();

if (!module.parent) {
  httpServer.listen(3000, '127.0.0.1');
}

module.exports.httpServer = httpServer;
module.exports.websocketServer = websocketServer;
