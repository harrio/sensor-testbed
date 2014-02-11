'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1').
  service('configService', function() {
      this.config = { range: 300 };
      this.setConfig = function(config) { this.config = config; };
      this.getConfig = function() { return this.config; };
    }
  );
