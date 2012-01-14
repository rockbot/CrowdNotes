/*  CrowdNotes v0.0.1

	app.js
	Wraps everything together in a pretty little bow.
	
    Raquel Velez
    10 Jan 2012 */

// Modules
var server = require('./server');
var addNote = require('./addNote');
var manageEvent = require('./manageEvent')
var revAllNotes = require('./reviewAllNotes');
var revMyNotes = require('./reviewMyNotes');
var db = require('./accessDB');

db.setup('mongodb://localhost/CrowdNotes');

// Define urls
var handle = {};
handle['/newNote'] = addNote.start;
handle['/upload'] = addNote.upload;
handle['/newEvent'] = manageEvent.create;
handle['/saveEvent'] = manageEvent.save;
handle['/reviewAllNotes'] = revAllNotes.start;
handle['/reviewMyNotes'] = revMyNotes.start;

// start the server
server.start(handle);

// At some point, figure out how to close the database when we're done with the app!
// db.closeDB();