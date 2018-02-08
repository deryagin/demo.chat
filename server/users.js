const _ = require('lodash');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const logger = require('./logger');

// todo: may be to use Set or such.
module.exports = {
  _users: [],

  forEach(callback) {
    return this._users.forEach(callback);
  },

  broadcast(message) {
    this._users.forEach((user) => {
      if (user.socket && user.socket.readyState === WebSocket.OPEN) {
        user.socket.send(JSON.stringify(message));
      }
    });
    logger.debug({
      event: 'broadcast',
      data: message,
    });
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
