const users = require('./users');
const WSClose = require('./websocket/WSCloseEvents');

function checkAlive() {
  users.forEach((user) => {
    if (!user.socket) {
      return;
    }

    if (!user.isAlive) {
      user.socket.close(
        WSClose.GOING_AWAY.CODE,
        WSClose.GOING_AWAY.DESC
      );
    }

    user.isAlive = false;
    user.socket.ping(() => {});
  });
}

function checkActivity(activityTimeout) {
  return () => {
    users.forEach((user) => {
      const now = new Date();
      const timeout = (now - user.lastActivityAt);
      if (activityTimeout < timeout) {
        user.socket.close(WSClose.DUE_USER_INACTIVITY.CODE);
      }
    });
  };
}

module.exports = {
  checkAlive,
  checkActivity,
};
