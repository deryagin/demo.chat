const Ajv = require('ajv');
const config = require('../config');

const pwd = config.get('app:pwd');
const ajv = new Ajv({
  allErrors: true,
  format: 'full',
  schemas: [
    require(`${pwd}/pub/schema/v1/chat.schema.json`),
    require(`${pwd}/pub/schema/v1/sections/data.schema.json`),
    require(`${pwd}/pub/schema/v1/sections/errors.schema.json`),
    require(`${pwd}/pub/schema/v1/sections/meta.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/LoginRequest.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/LoginResponse.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/ClientConnected.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/ClientDisconnected.schema.json`),
    require(`${pwd}/pub/schema/v1/payloads/ChatMessage.schema.json`),
  ]
});

function checkMessage(json) {
  try {
    var message = JSON.parse(json);
  } catch (exp) {
    const errorMessage = exp.message || 'Malformed JSON message.';
    return [{message: errorMessage}];
  }

  const validateRoot = ajv.getSchema('/schema/v1/chat.schema.json');
  validateRoot(message);
  if (validateRoot.errors) {
    return validateRoot.errors;
  }

  const validateData = ajv.getSchema(`/schema/v1/payloads/${message.data.type}.schema.json`);
  validateData(message.data);
  if (validateData.errors) {
    return validateData.errors;
  }
};

module.exports = {
  checkMessage,
};
