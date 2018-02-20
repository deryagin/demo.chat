const http = require('http');
const config = require('./config');
const websocket = require('./websocket/websocket');
const shutdown = require('./tools/shutdown');
const logger = require('./tools/logger');
const app = require('./app');

const httpServer = http.createServer(app);
const wsServer = websocket.createServer(httpServer);

process.on('uncaughtException', logger.uncaughtException);
process.once('SIGTERM', shutdown(httpServer));
process.once('SIGINT', shutdown(httpServer));

if (!module.parent) {
  const PORT = config.get('httpServer:port');
  const HOST = config.get('httpServer:host');
  httpServer.listen(PORT, HOST, () => logger.httpRunning(httpServer));
}

module.exports = {
  httpServer,
  wsServer,
};
