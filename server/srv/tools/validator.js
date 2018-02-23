// this module checks messages (incoming and outcoming)
// using json-schemas from pub/schema/v1/

const Ajv = require('ajv');
const config = require('../config');
const errors = require('../entity/errors');

const pwd = config.get('app:pwd');
const ajv = new Ajv({
  allErrors: true,
  format: 'full',
  schemas: [
    /* eslint-disable */
    require(`${pwd}/pub/schema/v1/chat.schema.json`),
    require(`${pwd}/pub/schema/v1/sections/data.schema.json`),
    require(`${pwd}/pub/schema/v1/sections/meta.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/ValidationErrors.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/RegisteringRequest.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/ClientRegistered.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/ClientConnected.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/ClientDisconnected.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/ClientGone.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/ChatMessage.schema.json`),
    /* eslint-enable */
  ],
});

function checkFull(message) {
  return checkMeta(message) || checkData(message.data);
}

function checkMeta(message) {
  const validateMeta = ajv.getSchema('/schema/v1/chat.schema.json');
  return validateMeta(message) ? validateMeta.errors : undefined;
}

function checkData(data) {
  const validateData = ajv.getSchema(`/schema/v1/payloads/${data.type}.schema.json`);
  if (!validateData) {
    throw new errors.ServerError(`Unknown JSON-schema file name = '${data.type}'`);
  }
  return validateData(data) ? validateData.errors : undefined;
}

module.exports = {
  checkFull,
  checkMeta,
  checkData,
};
