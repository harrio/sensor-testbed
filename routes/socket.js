/*
 * Serve content over a socket
 */
var _ = require('lodash');

var step = 10;
var client = null;
var buffer = emptyArray();

function emptyArray() {
  var array = [];
  for (var i = 0; i < 360 / step; i++) {
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
  var half = Math.floor(values.length / 2);
    if (values.length % 2)
    return values[half];
  else
    return (values[half-1] + values[half]) / 2.0;
}

function send(socket, data) {
  if (socket !== null) {
    socket.emit('data', data );
  }
}

exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
  console.log("conn");
  //setInterval(sendData(socket), 1000);
  client = socket;
  send(client, emptyArray());
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
};

exports.send = function(data) {
  if (data.indexOf("b") != -1) {
    var values = data.split(" ");
    if (values[1] != step) {
      step = values[1];
      buffer = emptyArray();  
    }
  } else if (data.indexOf("e") != -1) {
    //socket.send(buffer);
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
    var avg = median(_.map(_.initial(values), function(v) { return parseInt(v) }));
    //console.log("med: " + avg);
    buffer[angle / step] = { axis: angle, value: avg, heading: "sweep"};
    send(client, buffer);
  }
};

/*
module.exports = function (socket) {
  socket.emit('send:name', {
    name: 'Bob'
  });

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);

  console.log("conn");
	//setInterval(sendData(socket), 1000);
	var client = socket;
	send(client, emptyArray());
  socket.on('my other event', function (data) {
		console.log(data);
  });
};*/
