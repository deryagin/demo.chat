const bunyan = require('bunyan');
const config = require('../config');

module.exports = bunyan.createLogger({
  name: 'D8.Test',
  level: config.get('bunyan:level'),
  src: config.get('bunyan:src'),
});
