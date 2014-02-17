var RadarChart = require('../ui/radar-chart.js').RadarChart;

exports.radar = function(d3Service) {
  return {
    restrict: 'EA',
    scope: {
      data: '=' // bi-directional data-binding
    },
      // directive code
    link: function(scope, element, attrs) {
      d3Service.d3().then(function(d3) {
        scope.$watch('data', function(newData) {
          scope.render(newData);
        }, true);

        scope.render = function(data) {
          if (data) {
            RadarChart.draw(element[0],
              data,
              { maxValue: scope.$parent.config.range, radians: Math.PI, afterglow: scope.$parent.config.afterglow });
          }
        };
      });
    }
  };
};