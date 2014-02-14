'use strict';
var angular = require('angular');
require('ngRoute');
require('ngSocket');
//require('socket.io');
require('./services/d3Service.js');

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['ngRoute', 'btford.socket-io', 'd3']);

myApp.controller('radarCtrl', require('./controllers/radarCtrl.js').radarCtrl);
myApp.controller('configCtrl', require('./controllers/configCtrl.js').configCtrl);
myApp.directive('radar', require('./directives/radarDirective.js').radar);
myApp.directive('radarBars', require('./directives/radarBarsDirective.js').radarBars);
myApp.service('configService', require('./services/configService.js').configService);

myApp.factory('mySocket', function (socketFactory) {
  return socketFactory();
});

myApp.config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/view1', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    otherwise({
      redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
