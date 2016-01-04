var http = require("http");
var fs = require('fs');
var port = 4568;

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
console.log('Server running at http://127.0.0.1:' + port);