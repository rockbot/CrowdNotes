/*  CrowdNotes v0.0.1

	addNote.js
	Adds a new note to the system
	
    Raquel Velez
    10 Jan 2012 */

// Modules
var fs = require('fs');

// html to make the page look nice
var newNoteHTML = fs.readFileSync('views/post/newNote.html');

// respond to request for the page
function start(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  response.write(newNoteHTML);
  response.end();
}

// export for use by app.js
exports.start = start;