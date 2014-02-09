
/**
 * Module dependencies
 */

var express = require('express'),
  _ = require('lodash'),
  serialport = require("serialport"),
  routes = require('./routes'),
  api = require('./routes/api'),
  socket = require('./routes/socket'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 1);

var SerialPort = serialport.SerialPort;
serialPort = new SerialPort("/dev/tty.usbmodem1411",
  { baudrate: 14400,
  parser: serialport.parsers.readline("\n") });

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Continuing...");
});

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


// development only     
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
//io.sockets.on('connection', require('./routes/socket'));
socket.init(io, serialPort);

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

try {
  serialPort.open(function () {
    console.log('serial open');
    serialPort.on('data', function(data) {
      socket.send(data);
    });
  //serialPort.write("ls\n", function(err, results) {
  //  console.log('err ' + err);
  //  console.log('results ' + results);
  //});
  });
} catch (err) {
  console.log("serial port open failed: " + err);
}

