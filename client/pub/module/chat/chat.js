(function chatModule(angular) {

  var chat = angular.module('chat', []);
  chat.controller('ChatController', ChatController)

  function ChatController($rootScope, $scope, $location) {

    console.log('chatcontroller');

    var CLOSE_DUE_INACTIVITY_MESSAGE = 'Disconnected by the server due to inactivity.';

    var SERVER_UNAVAILABLE_MESSAGE = 'Chat server is unavailable';

    // todo: вынести настройку ws в фабрику/сервис
    var ws = null;

    var connectionTimeouts = {
      1: 3000,
      2: 5000,
    };

    $scope.typedText= '';

    $scope.maxLength = 150;

    $scope.messageList = [];

    $scope.sendMessage = sendMessage;

    $scope.chatExit = chatExit;

    tryConnect(1);

    function tryConnect(attemptNumber) {
      var maxAttempts = Object.keys(connectionTimeouts).length;
      if (attemptNumber > maxAttempts) {
        $rootScope.user = undefined;
        $location.path('/login');
        $scope.$apply();
        return;
      }

      if (!ws || ws.readyState !== WebSocket.OPEN) {
        ws = new WebSocket('ws://localhost:3000?userId=' + $rootScope.user.id);
        setupWebsocket(ws);

        setTimeout(function () {
          tryConnect(attemptNumber + 1);
        }, connectionTimeouts[attemptNumber]);
      }
    }

    function setupWebsocket(ws) {
      ws.onopen = function onOpen() {
        console.log('open');
      };

      ws.onmessage = function onMessage(event) {
        console.log('message', event);
        var message = decode(event.data);

        // todo: message validation
        if (message) {
          $scope.messageList.push(message);
          $scope.$apply();
        }
      };

      ws.onclose = function onClose(closeEvent) {
        console.log('close', closeEvent);
        var ABNORMAL_CLOSE_CODE = 1006;
        if (closeEvent.code === ABNORMAL_CLOSE_CODE) {
          $rootScope.notificationClass = 'error-notification';
          $rootScope.notificationText = closeEvent.reason || SERVER_UNAVAILABLE_MESSAGE;
        }

        var DUE_USER_INACTIVITY_CLOSE_CODE = 4000;
        if (closeEvent.code === DUE_USER_INACTIVITY_CLOSE_CODE) {
          $rootScope.notificationClass = 'info-notification';
          $rootScope.notificationText = closeEvent.reason || CLOSE_DUE_INACTIVITY_MESSAGE;
        }

        $rootScope.user = undefined;
        $location.path('/login');
        $scope.$apply();
      };

      ws.onerror = function onError() {
        console.log('error');
      };
    }

    function sendMessage() {
      console.log('sendMessage');
      $scope.typedText = $scope.typedText.trim();
      if ($scope.typedText) {
        var message = {
          type: 'ChatMessage',
          text: $scope.typedText,
        };
        ws.send(encode(message, $rootScope.user.id));
        $scope.typedText= '';
      }
      return false;
    }

    function chatExit() {
      // todo: share the codes with the server
      // see server/websocket/WSCloseEvents.js
      var CLOSE_CODE_NORMAL = 1000;
      ws.close(CLOSE_CODE_NORMAL);
      $rootScope.user = undefined;
      $location.path('/login');
    }

    function encode(data, userId) {
      var message = {
        data: data,
        meta: {
          version: 'v1',
          auth: userId ? {userId: userId} : undefined,
        },
      };
      return JSON.stringify(message);
    }

    function decode(json) {
      try {
        var message = JSON.parse(json);
        return message.data;
      } catch (exp) {
        var errorMessage = exp.message || 'Malformed JSON message.';
        return {errors: [{message: errorMessage}]};
      }
    }

  }

})(angular);
