const http = require('http');
const url = require('url');
const uuidv4 = require('uuid/v4');
const ws = require('ws');
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
    connections.push({
      userId: userId,
      socket: ws,
      connectedAt: new Date(),
    });
    const message = {
      // todo: think through entities, theirs types, schemas, validation and sharing all of these between clients and server
      entity: 'message',
      type: 'system.user.connected',
      text: `${user.nickname} joined.`,
      UTC: new Date().toISOString(),
    };
    connections.forEach((conn) => conn.socket.send(JSON.stringify(message)));

    ws.on('message', (json) => {
      console.log(`ws message: ${json}`, typeof json);
      let message = JSON.parse(json);
      if (message.text) {
        wsServer.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            message.nickname = user.nickname;
            message.UTC = new Date().toISOString();
            client.send(JSON.stringify(message));
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
        UTC: new Date().toISOString(),
        user: user,
      };
      const index = connections.findIndex((conn) => conn.socket === ws);
      connections.splice(index, 1);
      connections.forEach((conn) => conn.socket.send(JSON.stringify(message)));
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
        UTC: new Date().toISOString(),
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
