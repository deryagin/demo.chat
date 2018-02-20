const url = require('url');
const uuidv4 = require('uuid/v4');
const WebSocket = require('ws');
const config = require('../config');
const users = require('../entity/users');
const logger = require('../tools/logger');
const handlers = require('./handlers');
const periodics = require('./periodics');


function createServer(httpServer) {
  const wsServer = new WebSocket.Server({
    server: httpServer,
    maxPayload: config.get('wsServer:maxPayload'),
  });

  periodics.runCheckAlive().unref();
  periodics.runCheckInactivity().unref();

  wsServer.on('connection', (ws, req) => {
    const urlParsed = url.parse(req.url, true);
    const userId = urlParsed.query.userId;
    const user = users.byId(userId);

    if (!user) {
      logger.userUnknown(userId);
      return ws.close();
    }

    user.socket = ws;
    user.isAlive = true;
    user.connectedAt = new Date();
    user.lastActivityAt = new Date();

    user.socket.on('message', handlers.onMessage.bind(null, user));
    user.socket.on('close', handlers.onClose.bind(null, user));
    user.socket.on('error', handlers.onError);
    user.socket.on('pong', handlers.onPong.bind(null, user));

    logger.userConnected(user.public());

    // todo: extract ro standard broadcast-messages
    users.broadcast({
      id: uuidv4(),
      event: 'user:connected',
      text: `${user.nickname} joined the chat.`,
      time: new Date().toISOString(),
    });
  });

  return wsServer;
}

module.exports = {
  createServer,
};
