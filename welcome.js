/*  CrowdNotes v0.0.1

		welcome.js
		Greets the user and gives them some options
	
    Raquel Velez
    13 Jan 2012 */

// Modules
var fs = require('fs');
var querystring = require('querystring');
var myDB = require('./accessDB');

// html to make the page look nice
var welcomeHTML = fs.readFileSync('views/post/index.html');

// respond to request for the page
function start(request, response, postNote) {
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  response.write(welcomeHTML);
  response.end();
}
exports.start = start;

