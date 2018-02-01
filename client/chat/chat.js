(function chatModule(angular) {

  var chat = angular.module('chat', []);
  chat.controller('ChatController', ChatController)

  function ChatController($rootScope, $scope, $location) {

    console.log('chatcontroller');

    $scope.typedText= '';

    $scope.maxLength = 150;

    $scope.messageList = [];

    $scope.sendMessage = sendMessage;

    $scope.chatExit = chatExit;

    console.log('ws://localhost:3000?userId=' + $rootScope.user.id);
    var ws = new WebSocket('ws://localhost:3000?userId=' + $rootScope.user.id);

    ws.onopen = function onOpen() {
      console.log('open');
    };

    ws.onmessage = function onMessage(event) {
      console.log('message', event);
      var message = JSON.parse(event.data);

      // todo: message validation
      if (message) {
        $scope.messageList.push(message);

        // the same problem: https://stackoverflow.com/q/12304728/6229438
        $scope.$apply();
      }
    };

    ws.onclose = function onClose() {
      console.log('close');
    };

    ws.onerror = function onError() {
      console.log('error');
    };

    function sendMessage() {
      console.log('sendMessage');
      $scope.typedText = $scope.typedText.trim();
      if ($scope.typedText) {
        ws.send(JSON.stringify({
          entity: 'message',
          text: $scope.typedText
        }));
        $scope.typedText= '';
      }
      return false;
    }

    function chatExit() {
      ws.close();
      $rootScope.user = undefined;
      $location.path('/login');
    }
  }

})(angular);
