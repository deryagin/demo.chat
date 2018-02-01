const uuidv4 = require('uuid/v4');

module.exports = {
  _users: [],

  add(nickname) {
    const newcomer = {
      id: uuidv4(),
      entity: 'User',
      nickname: nickname,
      connectedAt: new Date(),
    };
    this._users.push(newcomer);
    return newcomer;
  },

  byId(userId) {
    return this._users.find((user) => user.id === userId)
  },

  byNickname(nickname) {
    return this._users.find((user) => user.nickname === nickname)
  },
};
