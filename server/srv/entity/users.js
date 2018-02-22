const _ = require('lodash');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const config = require('../config');
const converter = require('../tools/converter');
const validator = require('../tools/validator');
const logger = require('../tools/logger');

// todo: may be to use Set or such.
// todo: module.exports = {create, collection}; separate a user and a user collection
module.exports = {
  _users: [],

  forEach(callback) {
    return this._users.forEach(callback);
  },

  // todo: extract from here, maybe to transport.js?
  broadcast(data) {
    const message = converter.encode(data);

    if (config.get('app:validateOutput')) {
      const errors = validator.checkData(data);
      if (errors) {
        return logger.messageMalformed(message);
      }
    }

    this._users.forEach((user) => {
      if (user.socket && user.socket.readyState === WebSocket.OPEN) {
        user.socket.send(message);
      }
    });
    logger.messageBroadcasted(message);
  },

  add(nickname) {
    const newcomer = {
      id: uuidv4(),
      entity: 'User',
      nickname: nickname,
      connectedAt: null,
      lastActivityAt: null,
      socket: null,
      isAlive: false,
      public() {
        return _.pick(this, [
          'id',
          'entity',
          'nickname',
          'connectedAt',
          'lastActivityAt',
        ]);
      },
    };
    this._users.push(newcomer);
    return newcomer;
  },

  remove(userId) {
    const user = this.byId(userId);
    const index = this._users.indexOf(user);
    if (index > -1) {
      this._users.splice(index, 1);
    }
  },

  byId(userId) {
    return this._users.find((user) => user.id === userId)
  },

  byNickname(nickname) {
    return this._users.find((user) => user.nickname === nickname)
  },
};
