'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.board',
  'myApp.view1',
  'myApp.viewCopyright',
  'myApp.version',
  'ui.sortable'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/board'});
}]);
