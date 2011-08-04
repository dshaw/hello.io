var http = require('http')
  , io = require('socket.io')
  , RedisStore = io.RedisStore
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
        , "    content = function (msg) { document.getElementById('hello').innerHTML += msg; return msg; };\n"
        , "  hello.onkeyup = function (e) { socket.send(String.fromCharCode(e.keyCode)[(e.shiftKey) ? 'toLocaleUpperCase' : 'toLocaleLowerCase']()); };\n"  
        , "  socket.on('message', function () { console.log(content(' message ')); });\n"
        , "  ['connecting','connect','disconnect'].forEach(function(event) {\n"
        , "    socket.on(event, function () { console.log(content(' '+event+' ')); });\n"
        , "  });\n"
        , "};\n"
        , "</script>\n"
        , "<body id=hello contentEditable>Open your console...</body>\n\n"].join('');

      res.end(body);
   });

server.listen(port);

server.on('listening', function () { console.log('Hello.io listening on :%d', port) });

var socket = io.listen(server);

socket.configure(function () {
  socket.set('store', new RedisStore);
});

socket.on('connection', function (client) {
  console.log('connected');
  client.on('message', function () { console.log('message') });
  client.on('disconnect', function () { console.log('disconnected') });
});

