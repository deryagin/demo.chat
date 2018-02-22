// this module does a graceful and emergency server shutdown

const config = require('../config');
const users = require('../entity/users');
const messages = require('../entity/messages');
const logger = require('./logger');

function gracefully(httpServer) {
  return function shutdown() {
    httpServer.close();

    const message = messages.serverRebooted();
    users.broadcast(message);

    users.forEach((user) => (user.socket ? user.socket.close() : undefined));
    logger.httpShutdown();

    const timeout = config.get('httpServer:shutdownTimeout');
    setTimeout(() => process.exit(), timeout);
  };
}

module.exports = {
  gracefully,
};
