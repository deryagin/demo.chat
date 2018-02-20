module.exports = {
  app: {
    env: 'production',
    pwd: process.env.PWD,
  },
  httpServer: {
    host: '127.0.0.1',
    port: 3000,
  },
  wsServer: {
    maxPayload: 2048,
  },
  checkAlive: {
    interval: 60 * 1000, // 60 seconds
  },
  checkInactivity: {
    timeout: 10 * 60 * 1000, // 10 minutes
    interval: 30 * 1000, // 30 seconds
  },
  bunyan: {
    level: 'info',
    src: true,
  },
};
