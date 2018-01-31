const http = require('http');
const ws = require('ws');
const app = require('./app');
const errors = require('./errors');

errors.configure();

const httpServer = http.createServer(app);
const wsServer = new ws.Server({server: httpServer});

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`ws message: ${message}`);
    wsServer.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });
});

module.exports.httpServer = httpServer;
module.exports.wsServer = wsServer;

if (!module.parent) {
  httpServer.listen(3000, '127.0.0.1');
}
