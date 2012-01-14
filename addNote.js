/*  CrowdNotes v0.0.1

    addNote.js
    Adds a new note to the system
	
    Raquel Velez
    10 Jan 2012 */

// Modules
var fs = require('fs');
var querystring = require('querystring');
var myDB = require('./accessDB');

// html to make the page look nice
var newNoteHTML = fs.readFileSync('views/post/newNote.html');

// respond to request for the page
function create(request, response, postNote) {
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  response.write(newNoteHTML);
  response.end();
}

function save(request, response, postNote) {
  // console.log('before parsing: ' + postNote);
  // console.log(Object.keys(querystring.parse(postNote)))
	  
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write("You've sent: " + querystring.parse(postNote).note);
  response.end();
  
  var noteInfo = querystring.parse(postNote);
  
  var user = new myDB.Creator({
	  name : noteInfo.username
  , email: 'user@email.com'
  });

  user.save(function(err) {
    if (err) {throw err;}
    console.log("The new users's name is %s", user.name);
  });
}


// export for use by app.js
exports.create = create;
exports.save = save;
