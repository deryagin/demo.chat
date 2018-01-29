(function (document, angular) {

  var appName = 'chatApp';
  var appModule = angular.module(appName, [
    'ngRoute',
    'ngResource',
    'login',
    'chat'
  ]);

  appModule.config(function configureRoutes($routeProvider) {
    $routeProvider
      .when('/login', {
        controller: 'LoginController',
        templateUrl: 'login/login.html'
      })
      .when('/chat', {
        controller: 'ChatController',
        templateUrl: 'chat/chat.html'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });

  appModule.config(function configureHistory($locationProvider) {
      // $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
    }
  );

  angular.element(document).ready(function bootstrapApp() {
    angular.bootstrap(document, [appName]);
  });

})(document, angular);
