const url = require('url');
const uuidv4 = require('uuid/v4');
const WebSocket = require('ws');
const WSClose = require('./WSCloseEvents');
const users = require('../users');
const logger = require('../logger');


module.exports.create = function create(httpServer) {
  const wsServer = new WebSocket.Server({
    server: httpServer,
    maxPayload: 2048,
  });

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

  return wsServer;
};
