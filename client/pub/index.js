(function appModule(document, angular) {

  var appName = 'chatApp';
  var appModule = angular.module(appName, [
    'ngRoute',
    'ngResource',
    'login',
    'chat',
  ]);

  appModule.config(function configureRoutes($routeProvider) {
    $routeProvider
      .when('/login', {
        controller: 'LoginController',
        templateUrl: 'module/login/login.html',
      })
      .when('/chat', {
        controller: 'ChatController',
        templateUrl: 'module/chat/chat.html',
      })
      .otherwise({
        redirectTo: '/login',
      });
  });

  appModule.config(function configureHistory($locationProvider) {
    // $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  });

  angular.element(document).ready(function addBootstrap() {
    angular.bootstrap(document, [appName]);
  });
})(document, angular);
