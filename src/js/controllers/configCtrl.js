exports.configCtrl = function($scope, $http, mySocket, configService) {
    
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

  mySocket.on('status', function (status) {
    $scope.status = status;
  });

  $scope.statusStyle = function () {
    var color = $scope.status.port ? '#0F0' : '#F00';
    return { backgroundColor: color };
  };

  $scope.statusText = function() {
    return $scope.status.port ? 'UP' : 'DOWN';
  };
};
