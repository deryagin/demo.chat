// let's always take config name from cli option --config
// e.g. node server.js --config=./config/devel.js
// to replace any config option on the fly use for example --httpServer:port=3333
// to list all nconf params use console.log(nconf.get())

const path = require('path');
const nconf = require('nconf');

// get the value of --config cli option and
// require() an appropriate config file
const configName = () => nconf.get('config');
const configPath = () => path.resolve(configName());
const loadConfig = () => require(configPath()); // eslint-disable-line
const envAllowed = ['DEBUG'];

nconf
  .argv()
  .env(envAllowed)
  .use('supplied', {
    type: 'literal',
    store: loadConfig(),
  });

module.exports = nconf;
