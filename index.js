var http = require('http')
  , sio = require('socket.io')
  , RedisStore = sio.RedisStore
  , port = process.argv[2] || 9000

  , server = http.createServer(function(req, res){
      console.log('Hello.io http request');
      res.writeHead(200, {'Content-Type': 'text/html'});
      var body = ["<!DOCTYPE html>\n"
        , "<script src='/socket.io/socket.io.js'></script>\n"
        , "<script>\n"
        , "window.onload = function () {\n"
        , "  var socket = window.socket = io.connect(),\n"
        , "    hello = document.getElementById('hello'),\n"
        , "    log = function (msg) { console.log(msg); hello.innerHTML += msg;};\n"
        , "  hello.onkeyup = function (e) {\n"
        , "    var char = String.fromCharCode(e.keyCode)[(e.shiftKey) ? 'toLocaleUpperCase' : 'toLocaleLowerCase']();\n"
        , "    console.log('sending: ', char);\n"
        , "    socket.send(char);\n"
        , "  };\n"
        , "  socket.on('connecting', function (transport) { log(' connecting ' + transport + ' '); });\n"
        , "  socket.on('message', function (msg) { console.log('receiving: ', msg); log(' '+msg+' '); });\n"
        , "  socket.on('name', function (msg) { console.log(msg); });\n"
        , "  ['connect','connect_failed','disconnect'].forEach(function(event) {\n"
        , "    socket.on(event, function () { log(' '+event+' '\n); });\n"
        , "  });\n"
        , "};\n"
        , "</script>\n"
        , "<body id=hello contentEditable autofocus>Open your console...</body>\n\n"].join('');

      res.end(body);
   });

server.listen(port);

server.on('listening', function () { console.log('Hello.io listening on :%d', port) });

var io = sio.listen(server);

io.configure(function () {
  io.set('store', new RedisStore());
});

io.sockets.on('connection', function (socket) {
  function broadcast (msg) {
    console.log('broadcast:', msg);
    socket.broadcast.send(msg);
    socket.send(msg); // socket.broadcast.send excludes current socket
  }

  socket.send('Welcome to Hello.io');
  broadcast(socket.id + ' connected');

  socket.on('message', function (msg) { console.log('echoing:', msg); broadcast(msg); });
  socket.on('disconnect', function () { broadcast(socket.id + ' disconnected'); });
});

