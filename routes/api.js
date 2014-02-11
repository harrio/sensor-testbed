var serialPort = require("serialport"),
  _ = require("lodash"),
  socket = require("./socket");
  

exports.ports = function (req, res) {
  serialPort.list(function (err, ports) {
    res.json({
      ports: _.map(ports, function(port) { return port.comName; })
    });
  });
};

exports.setConfig = function(req, res) {
  var config = req.body;
  socket.configure(config);
  res.json(true);
};