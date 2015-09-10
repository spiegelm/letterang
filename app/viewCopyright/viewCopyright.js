'use strict';

angular.module('myApp.viewCopyright', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/copyright', {
    templateUrl: 'viewCopyright/viewCopyright.html',
    controller: 'ViewCopyrightController'
  });
}])

.controller('ViewCopyrightController', [function() {

}]);