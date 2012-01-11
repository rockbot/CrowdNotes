var mongoose = require('mongoose');

function start(dbToUse) {

	// Check connection to mongoDB
	var	Schema = mongoose.Schema;

	var NoteSchema = new Schema({
		title: String,
		body: String,
		date: Date
	});

	mongoose.connect(dbToUse);
	mongoose.model('Note', NoteSchema);

	var Note = mongoose.model('Note');

	var note = new Note();
	note.title = 'My first note';
	note.body = 'Note body';
	note.date = Date.now();

	note.save(function(err) {
		if (err) { throw err; }
		console.log('saved note');
		mongoose.disconnect();
	});

} 

exports.start = start;