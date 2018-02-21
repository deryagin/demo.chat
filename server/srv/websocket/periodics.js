const config = require('../config');
const users = require('../entity/users');
const WSClose = require('./reference').WSClose;

function runCheckAlive() {
  const CHECK_ALIVE_INTERVAL = config.get('checkAlive:interval');
  const checkAlive = () => {
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
  };
  return setInterval(checkAlive, CHECK_ALIVE_INTERVAL);
}

function runCheckInactivity() {
  const INACTIVITY_TIMEOUT = config.get('checkInactivity:timeout');
  const INACTIVITY_INTERVAL = config.get('checkInactivity:interval');
  const checkInactivity = () => {
    users.forEach((user) => {
      const currentTimeout = (new Date() - user.lastActivityAt);
      if (INACTIVITY_TIMEOUT < currentTimeout) {
        if (user.socket) {
          user.socket.close(WSClose.DUE_USER_INACTIVITY.CODE);
        } else {
          users.remove(user.id);
        }
      }
    });
  };

  return setInterval(checkInactivity, INACTIVITY_INTERVAL);
}

module.exports = {
  runCheckAlive,
  runCheckInactivity,
};
