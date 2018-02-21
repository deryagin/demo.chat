// let's always take config name from cli option --config
// e.g. node server.js --config=./config/devel.js
// nconf allow to replace any config option on the fly
// to do it use for example --httpServer:port=3333
// to list all nconf params use console.log(nconf.get())

const path = require('path');
const nconf = require('nconf');

// get the value of --config cli option and
const configName = () => nconf.get('config');

// require() an appropriate config file
const configPath = () => path.resolve(configName());
const loadConfig = () => require(configPath()); // eslint-disable-line

// allowed process.env variables
const envAllowed = ['DEBUG'];

nconf
  .argv()
  .env(envAllowed)
  .use('supplied', {
    type: 'literal',
    store: loadConfig(),
  });

module.exports = nconf;
