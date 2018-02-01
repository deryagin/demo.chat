(function loginModule(angular) {

  var login = angular.module('login', []);

  login.controller('LoginController', LoginController);

  function LoginController($rootScope, $scope, $http, $location) {

    var SERVER_URL = 'http://localhost:3000';

    var NICKNAME_REGEXP = /^[a-zA-Z0-9]{3,10}$/;

    var INVALID_NICKNAME = 'Invalid "nickname". Must have a-z, A-Z, 0-9.';

    $scope.nickname = '';

    $scope.maxLength = 10;

    $scope.errorMessage = '';

    $scope.warnMessage = '';

    $scope.isRequesting = false;

    $scope.connect = connect;

    function connect() {
      $scope.nickname = $scope.nickname.trim();
      if (!$scope.nickname || !NICKNAME_REGEXP.test($scope.nickname)) {
        $scope.errorMessage = INVALID_NICKNAME;
        return false;
      }

      $scope.errorMessage = '';
      $scope.warnMessage = '';
      $scope.isRequesting = true;
      makeRequest();
      return false;
    }

    function makeRequest() {
      $http({
        method: 'GET',
        url: SERVER_URL + '/login?nickname=' + encodeURI($scope.nickname),
      }).then(
        function onSuccess(response) {
          // todo: make $rootScope[chat] var and use it to store chat globals
          console.log(response);
          $rootScope.user = response.data;
          $location.path('/chat');
        },
        function onError(response) {
          console.log(response);
        }
      ).finally(
        function atFinally() {
          $scope.isRequesting = false;
        }
      );
    }
  }
})(angular);
