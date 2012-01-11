var server = require('./server');
var addNote = require('./addNote');
var revAllNotes = require('./reviewAllNotes');
var revMyNotes = require('./reviewMyNotes');

var handle = {};
handle['/newNote'] = addNote.start;
handle['/reviewAllNotes'] = revAllNotes.start;
handle['/reviewMyNotes'] = revMyNotes.start;

server.start(handle);