/*
 * Serve content over a socket
 */
var _ = require('lodash');

var step = 10;
var client = null;
var buffer = emptyArray();
var simulationId = null;

function emptyArray() {
  var array = [];
  for (var i = 0; i < 180 / step; i++) {
    var data = { axis: i * step, value: 0 };
    if (i === 0) {
      data.heading = "main";
    }
    array.push(data);
  }
  return array;
}

function median(values) {
  //console.log(values);
  values.sort(function(a, b) { return a - b; } );
  var diff = _.last(values) - _.first(values);
  var half = Math.floor(values.length / 2);
  if (values.length % 2)
    return { med: values[half], diff: diff };
  else
    return { mead: (values[half-1] + values[half]) / 2.0, diff: diff };
}

function send(socket, data, id) {
  if (socket !== null) {
    socket.emit(id, data);
  }
}

function simulate() {
  var buffer = _.map(emptyArray(),
    function(item) {
      item.value  = Math.random() * 300;
      item.diff = Math.random() * item.value;
      return item;
    });
  buffer[Math.floor(Math.random() * 17)].heading = "sweep";
  send(client, buffer, 'sweepStart');
  send(client, buffer, 'data');
  send(client, buffer, 'sweepEnd');
}

exports.init = function(io, serialPort) {
  io.sockets.on('connection', function (socket) {
  console.log("conn");
  //setInterval(sendData(socket), 1000);
    client = socket;
    send(client, emptyArray());
    socket.on('config', function (config) {
      console.log(config);
      serialPort.write(config.step +
      " " + config.sampleSize +
      "\n", function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
      });
    });
  });
};

exports.configure = function(config) {
  var configStr = config.step +
    " " + config.sampleSize +
    " " + config.pingDelay +
    "\n";
  console.log(configStr);
  serialPort.write(configStr, function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
};

exports.sendStatus = function(status) {
  send(client, status, 'status');
};

exports.send = function(data) {
  if (data.indexOf("b") != -1) {
    var values = data.split(" ");
    if (values[1] != step) {
      step = values[1];
      buffer = emptyArray();
    }
    send(client, buffer, 'sweepStart');
  } else if (data.indexOf("e") != -1) {
    send(client, buffer, 'sweepEnd');
    //console.log("sent " + buffer.length);
  } else {
    var params = data.split(" ");
    if (params.length < 2) {
      return;
    }
  for (var i = 0; i < buffer.length; i++) {
    delete buffer[i].heading;
  }
    var angle = params[0];
    var values = params[1].split(",");
    var medDiff = median(_.map(_.initial(values), function(v) { return parseInt(v); }));
    //console.log("med: " + avg);
    buffer[angle / step] = { axis: angle, value: medDiff.med, diff: medDiff.diff, heading: "sweep"};
    send(client, buffer, 'data');
  }
};

exports.startSimulation = function() {
  stopSimulation();
  simulationId = setInterval(simulate, 1000);
};

var stopSimulation = function() {
  clearInterval(simulationId);
};

exports.stopSimulation = stopSimulation;
