var ws = new WebSocket('ws://localhost:3000');

ws.onopen = function onOpen() {
  console.log('open');
};

ws.onmessage = function onMessage(event) {
  console.log('message', event);
  var data = JSON.parse(event.data);
  if (data.message) {
    var messageList = document.getElementById('message-list');
    var newMessage = document.createElement('li');
    newMessage.className += ' message-in-chat';
    newMessage.innerHTML = data.message;
    messageList.appendChild(newMessage);
  }
};

ws.onclose = function onClose() {
  console.log('close');
};

ws.onerror = function onError() {
  console.log('error');
};

var newMessage = document.getElementById('new-message-form');

newMessage.onsubmit = function () {
  var value = this.elements.message.value.trim();
  if (value) {
    ws.send(JSON.stringify({message: value}));
    this.elements.message.value = '';
  }
  return false;
};
