function configure() {
  process.on('uncaughtException', console.error);
}

module.exports.configure = configure;
