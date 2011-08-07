var http = require('http')
  , sio = require('socket.io')
  , RedisStore = sio.RedisStore
  , port = process.argv[2] || 9000

  , server = http.createServer(function(req, res){
      console.log('http request');
      res.writeHead(200, {'Content-Type': 'text/html'});
      var body = ["<!DOCTYPE html>\n"
        , "<script src='/socket.io/socket.io.js'></script>\n"
        , "<script>\n"
        , "window.onload = function () {\n"
        , "  var socket = io.connect(),\n"
        , "    hello = document.getElementById('hello'),\n"
        , "    log = function (msg) { hello.innerHTML += msg; console.log(msg); };\n"
        , "  hello.onkeyup = function (e) { socket.send(String.fromCharCode(e.keyCode)[(e.shiftKey) ? 'toLocaleUpperCase' : 'toLocaleLowerCase']()); };\n"  
        , "  socket.on('message', function () { log(' message '\n); });\n"
        , "  ['connecting','connect','connect_failed','disconnect'].forEach(function(event) {\n"
        , "    socket.on(event, function () { log(' '+event+' '\n); });\n"
        , "  });\n"
        , "};\n"
        , "</script>\n"
        , "<body id=hello contentEditable>Open your console...</body>\n\n"].join('');

      res.end(body);
   });

server.listen(port);

server.on('listening', function () { console.log('Hello.io listening on :%d', port) });

var io = sio.listen(server);

io.configure(function () {
  io.set('store', new RedisStore);
});

io.on('connection', function (socket) {
  console.log('connected');
  socket.on('message', function () { console.log('message') });
  socket.on('disconnect', function () { console.log('disconnected') });
});

