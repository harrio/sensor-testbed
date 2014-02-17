var RadarBars = require('../ui/radar-bars.js').RadarBars;

exports.radarBars = function(d3Service) {
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
            RadarBars.draw(element[0], data[0], function(d) { return d.value; });
          }
        };
      });
    }
  };
};

exports.radarDiffBars = function(d3Service) {
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
            RadarBars.draw(element[0], data[0], function(d) { return d.diff; });
          }
        };
      });
    }
  };
};