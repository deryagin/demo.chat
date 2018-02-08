// const uuidv4 = require('uuid/v4');
// const users = require('./users');
const logger = require('./logger');

module.exports = (httpServer) => {
  return function shutdown() {
    // users.broadcast({
    //   id: uuidv4(),
    //   type: 'message',
    //   text: 'Chat server was shutted down',
    //   time: new Date().toISOString(),
    // });

    httpServer.close(() => {
      logger.info({
        event: 'shutdown',
        data: {
          pid: process.pid,
          title: process.title,
          heapTotal: process.memoryUsage().heapTotal,
          heapUsed: process.memoryUsage().heapUsed,
          external: process.memoryUsage().external,
          uptime: process.uptime(),
        }
      });
      process.exit(0);
    });
  };
};
