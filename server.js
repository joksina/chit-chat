var http = require('http');
var fs = require('fs');
var express = require('express');
var port = (process.env.IP || 4568);

var html = fs.readFileSync(__dirname + '/public/index.html', {encoding: 'utf8'});
var css = fs.readFileSync(__dirname + '/public/styles.css', {encoding: 'utf8'});
var image = fs.readFileSync(__dirname + '/public/bk.jpg');

var app = http.createServer(function (request, response) {
  if(request.url === '/styles.css') {
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.end(css);
  } else if(request.url === '/bk.jpg') {
    response.writeHead(200, {'Content-Type': 'image/jpg'});
    response.end(image);
  } else {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(html);
  }

}).listen(port);

var io = require('socket.io').listen(app);

var crypto = require('crypto'),
  users = [];

io.sockets.on('connection', function (socket) {
  var id = crypto.randomBytes(20).toString('hex');
  users.push({ socket: socket, id: id, name: null });
  socket.emit('welcome', { message: 'Welcome To Chit Chat!', id: id });
  sendUsers();
  socket.on('send', function (data) {
      if(data.username !== '') {
        setUsers(id, data.username);
      }
      if(data.toUser !== '') {
        users.forEach(function(user) {
        if(user.id === data.toUser || user.id === data.fromUser) {
          user.socket.emit('receive', data);
        }
      });
      } else {
        io.sockets.emit('receive', data);
      }
  });
});

var sendUsers = function() {
  io.sockets.emit('users', users.map(function(user) {
    return { id: user.id, name: user.username };
  }));
};
var setUsers = function(id, name) {
  users.forEach(function(user) {
    if(user.id === id) {
      user.username = name;
      sendUsers();
    }
  });
};

console.log('Server running at http://127.0.0.1:' + port);