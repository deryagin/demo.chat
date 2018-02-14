const http = require('http');
const websocket = require('./websocket/websocket');
const periodics = require('./websocket/periodics');
const shutdown = require('./shutdown');
const config = require('./config');
const logger = require('./logger');
const app = require('./app');

const httpServer = http.createServer(app);
const wsServer = websocket.createServer(httpServer);

process.on('uncaughtException', logger.error.bind(logger));
process.once('SIGTERM', shutdown(httpServer));
process.once('SIGINT', shutdown(httpServer));

periodics.runCheckAlive().unref();
periodics.runCheckInactivity().unref();

if (!module.parent) {
  const PORT = config.get('httpServer:port');
  const HOST = config.get('httpServer:host');
  httpServer.listen(PORT, HOST, () => {
    logger.info({
      event: 'running',
      data: {
        host: httpServer.address().address,
        port: httpServer.address().port,
        pid: process.pid,
      }
    });
  });
}

module.exports.httpServer = httpServer;
module.exports.wsServer = wsServer;
