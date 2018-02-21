const users = require('../entity/users');
const messages = require('../entity/messages');
const converter = require('../tools/converter');
const validator = require('../tools/validator');
const logger = require('../tools/logger');
const WSClose = require('./reference').WSClose;

function onConnection(ws, req) {
  const urlParsed = url.parse(req.url, true);
  const userId = urlParsed.query.userId;
  const user = users.byId(userId);

  if (!user) {
    logger.clientUnknown(userId);
    return ws.close();
  }

  user.socket = ws;
  user.isAlive = true;
  user.connectedAt = new Date();
  user.lastActivityAt = new Date();

  user.socket.on('message', onMessage.bind(null, user));
  user.socket.on('close', onClose.bind(null, user));
  user.socket.on('error', onError);
  user.socket.on('pong', onPong.bind(null, user));

  const message = messages.clientConnected(user.nickname);
  users.broadcast(message);
  logger.clientConnected(user.public());
}

function onMessage(user, json) {
  const message = converter.decode(json);
  if (message.errors) {
    // user.socket.send({ }); // json errors
    return logger.messageMalformed(json);
  }

  const errors = validator.check(message);
  if (errors) {
    // user.socket.send({ }); // protocol errors
    return logger.messageMalformed(json);
  }

  users.broadcast(message.text, user.nickname);
  user.lastActivityAt = new Date();
}

function onClose(user, closeCode) {
  users.remove(user.id);

  // a user pressed 'exit' button in the chat
  if (closeCode === WSClose.NORMAL.CODE) {
    const message = messages.clientDisconnected(user.nickname);
    users.broadcast(message);
    logger.clientDisconnected(user.public());
  }

  // a user was disconnected by the server
  if (closeCode === WSClose.DUE_USER_INACTIVITY.CODE) {
    const message = messages.clientInactivated(user.nickname)
    users.broadcast(message);
    logger.clientInactivated(user.public());
  }

  // a user closed a browser and such
  const message = messages.clientGone(user.nickname);
  users.broadcast(message);
  logger.clientGone(user.public());
}

function onError(...args) {
  logger.websocketError(args);
}

function onPong(user) {
  user.isAlive = true;
}

module.exports = {
  onConnection,
  onMessage,
  onClose,
  onError,
  onPong,
};
