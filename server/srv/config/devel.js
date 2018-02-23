module.exports = {
  app: {
    env: 'development',
    pwd: process.env.PWD,
    validateOutput: true,
  },
  httpServer: {
    host: '127.0.0.1',
    port: 3000,
    shutdownTimeout: 1000, // milisec
  },
  wsServer: {
    maxPayload: 2048,
  },
  checkAlive: {
    interval: 60 * 1000, // milisec
  },
  checkInactivity: {
    timeout: 30 * 1000, // milisec
    interval: 10 * 1000, // milisec
  },
  bunyan: {
    name: 'Chat.Interview.Test',
    level: 'debug',
    src: true,
  },
};
