const _ = require('lodash');
const http = require('http');
const url = require('url');
const uuidv4 = require('uuid/v4');
const ws = require('ws');
const logger = require('./logger');
const app = require('./app');
const errors = require('./errors');
const users = require('./users');

errors.configure();

const httpServer = http.createServer(app);
const wsServer = new ws.Server({server: httpServer});
const connections = []; // todo: may be to use Set or such.

wsServer.on('connection', (ws, req) => {
  const urlParsed = url.parse(req.url, true);
  const userId = urlParsed.query.userId;

  const user = users.byId(userId);
  if (user) {
    const conn = {
      entity: 'connection',
      userId: userId,
      socket: ws,
      connectedAt: new Date(),
    };
    connections.push(conn);
    logger.info({data: _.pick(conn, ['entity', 'userId', 'connectedAt'])});
    const message = {
      // todo: think through entities, theirs types, schemas, validation and sharing all of these between clients and server
      id: uuidv4(),
      entity: 'message',
      type: 'system.user.connected',
      text: `${user.nickname} joined.`,
      time: new Date().toISOString(),
    };

    connections.forEach((conn) => conn.socket.send(JSON.stringify(message)));
    logger.debug({data: message});

    ws.on('message', (json) => {
      let message = JSON.parse(json);
      if (message.text) {
        wsServer.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            message.id = uuidv4();
            message.time = new Date().toISOString();
            message.nickname = user.nickname;
            client.send(JSON.stringify(message));
            logger.debug({data: message});
          }
        });
      }
    });

    ws.on('close', () => {
      const message = {
        id: uuidv4(),
        entity: 'message',
        type: 'system.user.left.chat',
        text: `${user.nickname} left the chat, connection lost.`,
        time: new Date().toISOString(),
        user: user,
      };
      const index = connections.findIndex((conn) => conn.socket === ws);
      connections.splice(index, 1);
      connections.forEach((conn) => conn.socket.send(JSON.stringify(message)));
      logger.info({data: message});
    });
  }
});


const IDLE_TIMEOUT = 30;
setInterval(() => {
  connections.forEach((conn, index) => {
    const now = new Date();
    const timeout = (now - conn.connectedAt) / 1000;
    if (IDLE_TIMEOUT < timeout) {
      const user = users.byId(conn.userId);
      const message = {
        id: uuidv4(),
        entity: 'message',
        type: 'system.user.disconnected.due.inactivity',
        text: `${user.nickname} was disconnected due to inactivity.`,
        time: new Date().toISOString(),
        user: user,
      };
      connections.splice(index, 1).pop();
      connections.forEach((conn) => conn.socket.send(JSON.stringify(message)));
    }
  });
}, 5000).unref();

module.exports.httpServer = httpServer;
module.exports.wsServer = wsServer;

if (!module.parent) {
  httpServer.listen(3000, '127.0.0.1');
}
