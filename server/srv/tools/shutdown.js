// this module does a graceful server shutdown

const logger = require('./logger');

module.exports = (httpServer) => {
  return function shutdown() {
    httpServer.close(() => {
      // todo: set maximum timeout
      // users.broadcast({
      //   id: uuidv4(),
      //   type: 'message',
      //   text: 'Chat server was shutted down',
      //   time: new Date().toISOString(),
      // });

      logger.httpShutdown();
      process.exit(0);
    });
  };
};
