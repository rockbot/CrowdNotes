/*  CrowdNotes v0.0.1

	reviewAllNotes.js
	Brings up all the notes from the session in one place
	
    Raquel Velez
    10 Jan 2012 */

// respond to request for the page
function start(request, response, postNote) {
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  response.write('Review ALL Notes!');
  response.end();
}

// let app.js use it
exports.start = start;