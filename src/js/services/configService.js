exports.configService = function() {
  this.config = { range: 300 };
  this.setConfig = function(config) { this.config = config; };
  this.getConfig = function() { return this.config; };
};