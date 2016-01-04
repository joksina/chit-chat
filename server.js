var http = require("http");
var fs = require('fs');
var crypto = require('crypto');
var port = 4568;
var users = [];
var io = require('socket.io');

var html = fs.readFileSync(__dirname + "/public/index.html", {encoding: 'utf8'});
var css = fs.readFileSync(__dirname + "/public/styles.css", {encoding: 'utf8'});

var app = http.createServer(function (request, response) {
  if (request.url === "/index.html") {
    response.writeHead(200, {'Content-type': 'text/html'});
    response.end(html);
  } else {
    response.writeHead(200, {'Content-type': 'text/css'});
    response.end(css);
  }
});

//listen to the app
app.listen(port, '127.0.0.1');
io.listen(app);

//connecting the socket to emmit a welcome message
io.socket.on('connection', function (data) {
  var id = crypto.randomBytes(20).toString('hex');
  users.push({data: data, id: id, name: null});
  socket.emit('welcome', { message: "Hello, Welcome to Chit Chat", id: id});
});


console.log('Server running at http://127.0.0.1:' + port);