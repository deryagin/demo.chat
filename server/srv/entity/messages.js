// these are messages parts that correspond one of
// pub/schema/v1/payloads/* schemas

function clientRegistered(user) {
  return {
    type: 'ClientRegistered',
    time: new Date().toISOString(),
    desc: `${user.nickname} registered to the chat.`,
    user,
  };
}

function clientConnected(nickname) {
  return {
    type: 'ClientConnected',
    time: new Date().toISOString(),
    text: `${nickname} joined the chat.`,
    nickname,
  };
}

function clientDisconnected(nickname) {
  return {
    type: 'ClientDisconnected',
    time: new Date().toISOString(),
    text: `${nickname} left the chat.`,
    nickname,
  };
}

function clientInactivated(nickname) {
  return {
    type: 'ClientInactivated',
    time: new Date().toISOString(),
    text: `${nickname} was disconnected by the server due to inactivity.`,
    nickname,
  };
}

function clientGone(nickname) {
  return {
    type: 'ClientGone',
    time: new Date().toISOString(),
    text: `${nickname} left the chat, connection lost.`,
    nickname,
  };
}

function chatMessage(text, nickname) {
  return {
    type: 'ChatMessage',
    time: new Date().toISOString(),
    text,
    nickname,
  };
}

function serverRebooted() {
  return {
    type: 'ServerRebooted',
    time: new Date().toISOString(),
    text: 'Chat server is rebooting. Please, try to connect later.',
  };
}

module.exports = {
  clientRegistered,
  clientConnected,
  clientDisconnected,
  clientInactivated,
  clientGone,
  chatMessage,
  serverRebooted,
};
