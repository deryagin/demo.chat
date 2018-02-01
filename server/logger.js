const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'D8.Test',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // todo: use config here
  src: true,
});
