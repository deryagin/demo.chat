const WebSocket = require('ws');
const config = require('../config');
const handlers = require('./handlers');
const periodics = require('./periodics');

function createServer(httpServer) {
  const wsServer = new WebSocket.Server({
    server: httpServer,
    maxPayload: config.get('wsServer:maxPayload'),
  });

  periodics.runCheckAlive().unref();
  periodics.runCheckInactivity().unref();
  wsServer.on('connection', handlers.onConnection);
  return wsServer;
}

module.exports = {
  createServer,
};
