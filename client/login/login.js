(function (angular) {

  var login = angular.module('login', []);
  login.controller('LoginController', LoginController);

  function LoginController() {

    var connectForm = document.getElementById('connect-form');

    connectForm.onsubmit = function () {
      var value = this.elements.nickname.value.trim();
      if (value) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/send", true);
        xhr.send(JSON.stringify({message: this.elements.message.value}));
        this.elements.message.value = '';
      }
      return false;
    };
    subscribe();
    function subscribe() {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/login", true);
      xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          setTimeout(subscribe, 500);
          return;
        }
        var messages = document.getElementById('messages');
        var paragraph = document.createElement('p');
        var text = document.createTextNode(this.responseText);
        paragraph.className += ' message';
        paragraph.appendChild(text);
        messages.appendChild(paragraph);
        subscribe();
      };
      xhr.send(null);
    }
  }

})(angular);
