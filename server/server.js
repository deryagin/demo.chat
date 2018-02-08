const http = require('http');
const url = require('url');
const uuidv4 = require('uuid/v4');
const WebSocket = require('ws');
const WSClose = require('./websocket/WSCloseEvents');
const shutdown = require('./shutdown');
const logger = require('./logger');
const users = require('./users');
const app = require('./app');

const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({
  server: httpServer,
  maxPayload: 2048,
});

process.on('uncaughtException', logger.error.bind(logger));
process.once('SIGTERM', shutdown(httpServer));
process.once('SIGINT', shutdown(httpServer));

// todo: think through entities, theirs types, schemas, validation and sharing all of these between clients and server
wsServer.on('connection', (ws, req) => {
  const urlParsed = url.parse(req.url, true);
  const userId = urlParsed.query.userId;
  const user = users.byId(userId);

  if (!user) {
    logger.warn({
      event: 'connection',
      data: `Invalid userId=${userId} parameter.`,
    });
    return ws.close();
  }

  user.socket = ws;
  user.isAlive = true;
  user.connectedAt = new Date();
  user.lastActivityAt = new Date();

  // todo: extract to standard log-objects
  logger.info({
    event: 'connection',
    data: user.public(),
  });

  // todo: extract ro standard broadcast-messages
  users.broadcast({
    id: uuidv4(),
    type: 'message',
    text: `${user.nickname} joined the chat.`,
    time: new Date().toISOString(),
  });

  user.socket.on('message', (json) => {
    // todo: try/catch + socket.close(WSClose.INVALID_DATA.CODE)
    let message = JSON.parse(json);
    logger.debug({
      event: 'message',
      data: message,
    });

    if (message.text) {
      message.id = uuidv4();
      message.time = new Date().toISOString();
      message.nickname = user.nickname;
      users.broadcast(message);
      user.lastActivityAt = new Date();
    }
  });

  user.socket.on('close', (code) => {
    users.remove(user.id);

    if (code === WSClose.NORMAL.CODE) {
      logger.info({
        event: 'disconnection',
        data: user.public(),
      });

      return users.broadcast({
        id: uuidv4(),
        entity: 'message',
        type: 'system.user.left.chat',
        text: `${user.nickname} left the chat.`,
        time: new Date().toISOString(),
      });
    }

    if (code === WSClose.DUE_USER_INACTIVITY.CODE) {
      logger.info({
        event: 'termination',
        data: user.public(),
      });

      return users.broadcast({
        id: uuidv4(),
        entity: 'message',
        type: 'system.user.left.chat',
        text: `${user.nickname} was disconnected due to inactivity.`,
        time: new Date().toISOString(),
      });
    }

    // WSClose.GOING_AWAY.CODE and other cases
    logger.info({
      event: 'disconnection',
      data: user.public(),
    });

    users.broadcast({
      id: uuidv4(),
      entity: 'message',
      type: 'system.user.left.chat',
      text: `${user.nickname} left the chat, connection lost.`,
      time: new Date().toISOString(),
    });
  });

  user.socket.on('error', (...args) => {
    logger.error({
      event: 'error',
      data: args,
    });
  });

  user.socket.on('pong', () => {
    user.isAlive = true;
  });
});


const ALIVE_CHECK_INTERVAL = 60 * 1000; // 60 seconds
setInterval(checkAlive, ALIVE_CHECK_INTERVAL).unref();

function checkAlive() {
  users.forEach((user) => {
    if (!user.socket) {
      return;
    }

    if (!user.isAlive) {
      user.socket.close(
        WSClose.GOING_AWAY.CODE,
        WSClose.GOING_AWAY.DESC
      );
    }

    user.isAlive = false;
    user.socket.ping(() => {});
  });
}

const ACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const ACTIVITY_CHECK_INTERVAL = 30 * 1000; // 30 seconds
setInterval(checkActivity, ACTIVITY_CHECK_INTERVAL).unref();

function checkActivity() {
  users.forEach((user) => {
    const now = new Date();
    const timeout = (now - user.lastActivityAt);
    if (ACTIVITY_TIMEOUT < timeout) {
      user.socket.close(WSClose.DUE_USER_INACTIVITY.CODE);
    }
  });
}

if (!module.parent) {
  httpServer.listen(3000, '127.0.0.1');
}

module.exports.httpServer = httpServer;
module.exports.wsServer = wsServer;
