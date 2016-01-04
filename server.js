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
io.socket.on('connection', function (socket) {
  var id = crypto.randomBytes(20).toString('hex');
  users.push({socket: socket, id: id, name: null});
  socket.emit('welcome', { message: "Hello, Welcome to Chit Chat", id: id});
  sendUser();
  socket.on('send', function (data) {
    if(data.username !== '') {
      setUser(id, data.username);
    } else {
      return alert('please enter your username');
    }
    if(data.toUser !== '') {
      _.each(users, function (user) {
        if (user.id === data.toUser || user.id === data.fromUser) {
          user.socket.emit('receive', data);
        }
      });
    } else {
      io.socket.emit('receive', data);
    }
  });
});

//send the users
var sendUser = function() {
  io.sockets.emit('users', _.map(users, function (user) {
    return { id: user.id, name: user.username };
  }));
};
//Creating a funtion to set users
var setUser = function (id, name) {
  _.each(users, function (user) {
    if(user.id === id) {
      user.username = name;
      sendUser();
    }
  });
};

//add event listener

console.log('Server running at http://127.0.0.1:' + port);