// this module does bi-directional conversion json <-> object
// json must fit pub/schema/v1/sections/meta.schema.json format
// object must correspond pub/schema/v1/sections/data.schema.json format

const uuidv4 = require('uuid/v4');

function encode(data, userId) {
  const message = {
    data: data,
    meta: {
      id: uuidv4(),
      version: 'v1',
      auth: userId ? {userId} : undefined,
    },
  };
  return JSON.stringify(message);
}

function decode(json) {
  try {
    const message = JSON.parse(json);
    return message.data;
  } catch (exp) {
    const errorMessage = exp.message || 'Malformed JSON message.';
    return {errors: [{message: errorMessage}]};
  }
}

module.exports = {
  encode,
  decode,
};
