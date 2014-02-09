'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    socket.on('data', function (data) {
      $scope.data = [data];
    });

    $scope.steps = [
      5, 10, 15, 20
    ];

    $scope.samples = [
      1, 3, 5, 7, 9
    ];

    $scope.ranges = [
      50, 100, 150, 200, 250, 300
    ];

    $scope.config = {
      step: $scope.steps[1],
      sampleSize: $scope.samples[2],
      range: $scope.ranges[5]
    };

    $scope.save = function(config) {
      socket.emit('config', config);
    };

  }).
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('send:time', function (data) {
      $scope.time = data.time;
    });
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
