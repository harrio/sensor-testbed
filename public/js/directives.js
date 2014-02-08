'use strict';

/* Directives */

angular.module('myApp.directives', ['d3']).
	directive('appVersion', function (version) {
		return function(scope, elm, attrs) {
			elm.text(version);
		};
	}).
	directive('radar', ['d3Service', function(d3Service) {
		return {
			restrict: 'EA',
			scope: {
				data: '=' // bi-directional data-binding
			},
			// directive code
			link: function(scope, element, attrs) {
				d3Service.d3().then(function(d3) {
					scope.$watch('data', function(newData) {
						console.log("new data: " + newData);
						scope.render(newData);
					}, true);

					scope.render = function(data) {
						console.log("dir data: " + data);
						if (data) {
							RadarChart.draw(element[0], data);
						}
					};
				});
			}};
		}]);
