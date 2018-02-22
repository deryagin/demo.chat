// this module contains WebSocket close codes
// base on: https://github.com/theturtle32/WebSocket-Node/blob/0713ded3214231d34ca9b6f94fe8483e70b6a1e9/lib/WebSocketConnection.js#L155
// see also: https://www.iana.org/assignments/websocket/websocket.xml#close-code-number

const WSClose = {

  // all standard codes:
  NORMAL: {
    CODE: 1000,
    DESC: 'Normal connection closure',
  },
  GOING_AWAY: {
    CODE: 1001,
    DESC: 'Remote peer is going away',
  },
  PROTOCOL_ERROR: {
    CODE: 1002,
    DESC: 'Protocol error',
  },
  UNPROCESSABLE_INPUT: {
    CODE: 1003,
    DESC: 'Unprocessable input',
  },
  RESERVED: {
    CODE: 1004,
    DESC: 'Reserved',
  },
  NOT_PROVIDED: {
    CODE: 1005,
    DESC: 'Reason not provided',
  },
  ABNORMAL: {
    CODE: 1006,
    DESC: 'Abnormal closure, no further detail available',
  },
  INVALID_DATA: {
    CODE: 1007,
    DESC: 'Invalid data received',
  },
  POLICY_VIOLATION: {
    CODE: 1008,
    DESC: 'Policy violation',
  },
  MESSAGE_TOO_BIG: {
    CODE: 1009,
    DESC: 'Message too big',
  },
  EXTENSION_REQUIRED: {
    CODE: 1010,
    DESC: 'Extension requested by client is required',
  },
  INTERNAL_SERVER_ERROR: {
    CODE: 1011,
    DESC: 'Internal Server Error',
  },
  TLS_HANDSHAKE_FAILED: {
    CODE: 1015,
    DESC: 'TLS Handshake Failed',
  },

  // some custom codes:
  DUE_USER_INACTIVITY: {
    CODE: 4000,
    DESC: 'Connection was closed due to inactivity',
  },
};

module.exports = {
  WSClose,
};
