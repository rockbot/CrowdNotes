/*  CrowdNotes v0.0.1

	reviewMyNotes.js
	list all notes created by the user
	
    Raquel Velez
    10 Jan 2012 */

// respond to request to access the page
function start(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  response.write('Review MY Notes!');
  response.end();
}

// let app.js play 
exports.start = start;