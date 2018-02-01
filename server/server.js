const http = require('http');
const url = require('url');
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
    connections.push({userId: userId, socket: ws});
    const message = {
      // todo: think through entities, theirs types, schemas, validation and sharing all of these between clients and server
      entity: 'message',
      type: 'system.user.connected',
      text: `${user.nickname} joined.`,
      UTC: new Date().toISOString(),
    };
    connections.forEach((conn) => conn.socket.send(JSON.stringify(message)));
  }

  ws.on('message', (json) => {
    console.log(`ws message: ${json}`, typeof json);
    let message = JSON.parse(json);
    if (message.text) {
      wsServer.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          message.nickname = 'vasya';
          message.UTC = new Date().toISOString();
          client.send(JSON.stringify(message));
        }
      });
    }
  });
});

module.exports.httpServer = httpServer;
module.exports.wsServer = wsServer;

if (!module.parent) {
  httpServer.listen(3000, '127.0.0.1');
}
