var _ = require('lodash');

exports.radarCtrl = function ($scope, mySocket, configService) {
	mySocket.on('sweepStart', function (data) {
    $scope.config = configService.getConfig();
    if ($scope.data && $scope.data.length > $scope.config.afterglow + 1) {
      $scope.data = _.rest($scope.data);
    }
  });

  mySocket.on('data', function (data) {
    $scope.config = configService.getConfig();
    if (!$scope.data || $scope.data.length === 0) {
      $scope.data = [data];
    } else {
      var newData = $scope.data;
      newData[$scope.data.length - 1] = data;
      $scope.data = newData;
    }

  });

  mySocket.on('sweepEnd', function (data) {
    $scope.config = configService.getConfig();
    var newData = $scope.data;
    newData.push([]);
    $scope.data = newData;
  });
};