/*  CrowdNotes v0.0.1

	app.js
	Wraps everything together in a pretty little bow.
	
    Raquel Velez
    10 Jan 2012 */

// Modules
var server = require('./server');
var welcome = require('./welcome');
var addNote = require('./addNote');
var manageEvent = require('./manageEvent');
var manageUsers = require('./manageUsers');
var revAllNotes = require('./reviewAllNotes');
var revMyNotes = require('./reviewMyNotes');
var db = require('./accessDB');

db.setup('mongodb://localhost/CrowdNotes');

// Define urls
var handle = {};
handle['/'] = welcome.start;
handle['/newNote'] = addNote.create;
handle['/saveNote'] = addNote.save;
handle['/newEvent'] = manageEvent.create;
handle['/saveEvent'] = manageEvent.save;
handle['/newUser'] = manageUsers.create;
handle['/saveUser'] = manageUsers.save;
handle['/reviewAllNotes'] = revAllNotes.start;
handle['/reviewMyNotes'] = revMyNotes.start;

// start the server
server.start(handle);

// At some point, figure out how to close the database when we're done with the app!
// db.closeDB();
