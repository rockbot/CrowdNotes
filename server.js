/*  CrowdNotes v0.0.1

	server.js
	create the server and handle the various url requests
	
    Raquel Velez
    10 Jan 2012 */

// Modules

var http = require('http');
var url = require('url');

// For those times when a page doesn't exist
function render404(request, response) {
  response.writeHead(404);
  response.write('404 File Not Found');
  response.end();
}

// Get the party (erm, server) started, prep url parser
function start(handle) {
  function onRequest(request, response) {
    // parse the url, make sure we're going to the right spot
		// var addNoteRegex = new RegExp('^/newNote/?$');
  	var pathname = url.parse(request.url).pathname;
   
		// prepare for incoming requests
		var postNote = '';
		request.setEncoding('utf8');
	
		request.addListener('data', function(postNoteChunk) {
			postNote += postNoteChunk;
			// console.log('Received POST note chunk "' + postNoteChunk + '".')
		});
	
		request.addListener('end', function() {
			// do some routing
		    if (typeof handle[pathname] === 'function') {
		      handle[pathname](request, response, postNote);
		    } else {
		      render404(request, response);
		    }
		});
  }

  // Create the server
  var server = http.createServer(onRequest);

  // listen on the server
  server.listen(8888);
  
  // make sure everything's playing nice
  console.log('Listening on http://localhost:8888');
}

// send it out so app.js can use it
exports.start = start;