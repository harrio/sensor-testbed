/*
 * Serve content over a socket
 */

var step = 10;

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

function send(socket, data) {
  if (socket !== null) {
    socket.emit('data', data );
  }
}

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
};
