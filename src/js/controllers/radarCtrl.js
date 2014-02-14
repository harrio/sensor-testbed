exports.radarCtrl = function ($scope, mySocket, configService) {
	mySocket.on('data', function (data) {
    $scope.config = configService.getConfig();
    $scope.data = [data];
  });
};