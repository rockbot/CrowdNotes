/*  CrowdNotes v0.0.1
    Raquel Velez
    10 Jan 2012 */

// Modules

var http = require('http');

// Create the server
var server = http.createServer(function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  response.write('BOOYAH!');
  response.end();
});

// listen on the server
server.listen(8888);

// make sure everything's playing nice
console.log('Listening on http://localhost:8888');
