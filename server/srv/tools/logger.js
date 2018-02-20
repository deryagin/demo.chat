const bunyan = require('bunyan');
const config = require('../config');

const logger = bunyan.createLogger({
  name: config.get('bunyan:name'),
  level: config.get('bunyan:level'),
  src: config.get('bunyan:src'),
});

function uncaughtException(...args) {
  logger.error({
    event: 'process:uncaughtException',
    data: args,
  });
}

function httpRunning(httpServer) {
  logger.info({
    event: 'http:running',
    data: {
      host: httpServer.address().address,
      port: httpServer.address().port,
      pid: process.pid,
    }
  });
}

function httpShutdown() {
  logger.info({
    event: 'http:shutdown',
    data: {
      pid: process.pid,
      title: process.title,
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
      external: process.memoryUsage().external,
      uptime: process.uptime(),
    },
  });
}

function userUnknown(userId) {
  logger.warn({
    event: 'user:unknown',
    data: {userId},
  });
}

function userConnected(user) {
  logger.info({
    event: 'user:connected',
    data: user,
  });
}

function userDisconnected(user) {
  logger.info({
    event: 'user:disconnected',
    data: user,
  });
}

function userInactivated(user) {
  logger.info({
    event: 'user:inactivated',
    data: user,
  });
}

function userGone(user) {
  logger.info({
    event: 'user:gone',
    data: user,
  });
}

function chatMessage(message) {
  logger.debug({
    event: 'chat:message',
    data: message,
  });
}

function chatBroadcast(message) {
  logger.debug({
    event: 'chat:broadcast',
    data: message,
  });
}

function websocketError(...args) {
  logger.error({
    event: 'websocket:error',
    data: args,
  });
}

module.exports = {
  uncaughtException,
  httpRunning,
  httpShutdown,
  userUnknown,
  userConnected,
  userDisconnected,
  userInactivated,
  userGone,
  chatMessage,
  chatBroadcast,
  websocketError,
};
