const uuidv4 = require('uuid/v4');
const users = require('../entity/users');
const logger = require('../tools/logger');
const WSClose = require('./reference').WSClose;

function onMessage(user, json) {
  // todo: validate here
  let message = JSON.parse(json);
  logger.chatMessage(message);

  if (message.text) {
    message.id = uuidv4();
    message.time = new Date().toISOString();
    message.nickname = user.nickname;
    users.broadcast(message);
    user.lastActivityAt = new Date();
  }
}

function onClose(user, closeCode) {
  users.remove(user.id);

  // a user pressed 'exit' button in the chat
  if (closeCode === WSClose.NORMAL.CODE) {
    logger.userDisconnected(user.public());
    return users.broadcast({
      id: uuidv4(),
      type: 'event',
      event: 'user:disconnected',
      text: `${user.nickname} left the chat.`,
      time: new Date().toISOString(),
    });
  }

  // a user was disconnected by the server
  if (closeCode === WSClose.DUE_USER_INACTIVITY.CODE) {
    logger.userInactivated(user.public());
    return users.broadcast({
      id: uuidv4(),
      type: 'event',
      event: 'user:inactivated',
      text: `${user.nickname} was disconnected due to inactivity.`,
      time: new Date().toISOString(),
    });
  }

  // a user closed a browser and such
  logger.userGone(user.public());
  users.broadcast({
    id: uuidv4(),
    type: 'event',
    event: 'user:gone',
    text: `${user.nickname} left the chat, connection lost.`,
    time: new Date().toISOString(),
  });
}

function onError(...args) {
  logger.websocketError(args);
}

function onPong(user) {
  user.isAlive = true;
}

module.exports = {
  onMessage,
  onClose,
  onError,
  onPong,
};
