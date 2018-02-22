// this module contains standard logger messages
// it's made to purge business logic from an infrastructure

const bunyan = require('bunyan');
const config = require('../config');

const logger = bunyan.createLogger({
  name: config.get('bunyan:name'),
  level: config.get('bunyan:level'),
  src: config.get('bunyan:src'),
});

function httpRunning(httpServer) {
  logger.info({
    event: 'http:running',
    data: {
      host: httpServer.address().address,
      port: httpServer.address().port,
      pid: process.pid,
      title: process.title,
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
      external: process.memoryUsage().external,
    },
  });
}

function uncaughtException(error) {
  logger.error({
    event: 'process:uncaughtException',
    data: JSON.stringify({
      code: error.code,
      message: error.message,
      stack: error.stack,
    }),
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

function clientUnknown(userId) {
  logger.warn({
    event: 'user:unknown',
    data: {userId},
  });
}

function clientConnected(user) {
  logger.info({
    event: 'client:connected',
    data: user,
  });
}

function clientDisconnected(user) {
  logger.info({
    event: 'client:disconnected',
    data: user,
  });
}

function clientInactivated(user) {
  logger.info({
    event: 'client:inactivated',
    data: user,
  });
}

function clientGone(user) {
  logger.info({
    event: 'client:gone',
    data: user,
  });
}

function messageReceived(message) {
  logger.debug({
    event: 'message:received',
    data: message,
  });
}

function messageMalformed(json) {
  logger.debug({
    event: 'message:malformed',
    data: json,
  });
}

function messageBroadcasted(message) {
  logger.debug({
    event: 'message:broadcasted',
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
  clientUnknown,
  clientConnected,
  clientDisconnected,
  clientInactivated,
  clientGone,
  messageReceived,
  messageMalformed,
  messageBroadcasted,
  websocketError,
};
