'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('RadarCtrl', function ($scope, socket, configService) {

    socket.on('data', function (data) {
      $scope.config = configService.getConfig();
      $scope.data = [data];
    });
  }).
  controller('ConfigCtrl', function($scope, $http, socket, configService) {
    //$http.get('/config/ports').
    //success(function(data, status, headers, config) {
    //  $scope.ports = data.ports;
    //});

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
      configService.setConfig(config);
      $http.post('/setConfig', config).
      success(function(data) {
        
      });
    };

    $scope.status = { port: false };

    socket.on('status', function (status) {
      $scope.status = status;
    });

    $scope.statusStyle = function () {
      var color = $scope.status.port ? '#0F0' : '#F00';
      
      return { backgroundColor: color };
    };

    $scope.statusText = function() {
      return $scope.status.port ? 'UP' : 'DOWN';
    };

  });
  
