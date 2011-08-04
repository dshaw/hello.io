var http = require('http'), 
    io = require('socket.io'),
    port = process.argv[2] || 9000,

    server = http.createServer(function(req, res){
      console.log('http request');
      res.writeHead(200, {'Content-Type': 'text/html'});
      var body = ["<script src='/socket.io/socket.io.js'></script>\n"
        , "<script>\n"
        , "var socket = io.connect();\n"
        , "socket.on('connect', function(){ console.log('connect') });\n"
        , "socket.on('message', function(){ console.log('message') });\n"
        , "socket.on('disconnect', function(){ console.log('disconnect') });\n"
        , "</script>\n"
        , "Open your console...\n\n"].join('');

      res.end(body);
   });

server.listen(port);

server.on('listening', function () { console.log('Hello.io listening on :%d', port) });

var socket = io.listen(server);

socket.on('connection', function (client) {
  console.log('connected');
  client.on('message', function () { console.log('message') });
  client.on('disconnect', function () { console.log('disconnected') });
});

