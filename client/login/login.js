(function loginModule(angular) {

  var login = angular.module('login', []);

  login.controller('LoginController', LoginController);

  function LoginController($rootScope, $scope, $http, $location) {

    var SERVER_URL = 'http://localhost:3000';

    var NICKNAME_REGEXP = /^[a-zA-Z0-9]{3,10}$/;

    var INVALID_NICKNAME = 'Invalid "nickname". Must have a-z, A-Z, 0-9.';

    var DEFAULT_ERROR_MSG = 'Failed to connect.';

    var MALFORMED_REQUEST = 'Malformed request.';

    var SERVER_UNAVAILABLE = 'Chat server is unavailable';

    $scope.nickname = '';

    $scope.maxLength = 10;

    $scope.notificationClass = $rootScope.notificationClass || '';

    $scope.notificationText = $rootScope.notificationText || '';

    $scope.isRequesting = false;

    $scope.connect = connect;

    function connect() {
      resetNitifications();

      $scope.nickname = $scope.nickname.trim();
      if (!$scope.nickname || !NICKNAME_REGEXP.test($scope.nickname)) {
        $scope.notificationClass = 'error-notification';
        $scope.notificationText = INVALID_NICKNAME;
        return false;
      }

      $scope.isRequesting = true;
      makeRequest();
      return false;
    }

    function makeRequest() {
      // todo: переделать на POST
      $http({
        method: 'GET',
        url: SERVER_URL + '/login?nickname=' + encodeURI($scope.nickname)
      }).then(
        function onSuccess(response) {
          $rootScope.user = response.data;
          $location.path('/chat');
          console.log($rootScope.user);
        },
        function onError(response) {
          resetNitifications();
          $scope.isRequesting = false;

          if (response.status === -1) {
            $scope.notificationClass = 'error-notification';
            $scope.notificationText = SERVER_UNAVAILABLE;
            return;
          }

          if (response.status === 400) {
            $scope.notificationClass = 'error-notification';
            $scope.notificationText = (response.data.message || MALFORMED_REQUEST);
            return;
          }

          $scope.notificationClass = 'error-notification';
          $scope.notificationText = DEFAULT_ERROR_MSG;
        }
      );
    }

    function resetNitifications() {
      $rootScope.notificationClass = '';
      $rootScope.notificationText = '';
      $scope.notificationClass = '';
      $scope.notificationText = '';
    }
  }
})(angular);
