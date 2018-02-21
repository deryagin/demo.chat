// these are messages parts that correspond one of
// pub/schema/v1/payloads schemas

function clientConnected(nickname) {
  return {
    type: 'ClientConnected',
    time: new Date().toISOString(),
    text: `${nickname} joined the chat.`,
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
    text: `${nickname} was disconnected due to inactivity.`,
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

module.exports = {
  clientConnected,
  clientDisconnected,
  clientInactivated,
  clientGone,
  chatMessage,
};
