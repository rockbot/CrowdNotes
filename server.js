/*  CrowdNotes v0.0.1
    Raquel Velez
    10 Jan 2012 */

// Modules

var http = require('http');
var url = require('url');
var fs = require('fs');

var newNoteFormHTML = fs.readFileSync('views/post/newNote.html');

function renderAddNoteForm(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  response.write(newNoteFormHTML);
  response.end();
}

function render404(request, response) {
  response.writeHead(404);
  response.write('404 File Not Found');
  response.end();
}

// Create the server
var server = http.createServer(function(request, response) {
  // parse the url, make sure we're going to the right spot
  var addNoteRegex = new RegExp('^/newNote/?$');
  var pathname = url.parse(request.url).pathname;
  
  if (addNoteRegex.test(pathname)) {
    renderAddNoteForm(request, response);
  } else {
    render404(request, response);
  }
    
});

// listen on the server
server.listen(8888);

// make sure everything's playing nice
console.log('Listening on http://localhost:8888');
