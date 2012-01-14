var mongoose = require('mongoose');

function setup(dbToUse) {

	// Check connection to mongoDB
	var	Schema = mongoose.Schema;
	
	// Define schema
	var EventSchema = new Schema({
	    name    	: String
	  , date		: { type: Date, default: Date.now }
	  , description : String
	  , notes		: [{ type: Schema.ObjectId, ref: 'Note' }]
	});

	var CreatorSchema = new Schema({
		name	: String
	  , email	: String 
	  , notes	: [{ type: Schema.ObjectId, ref: 'Note' }]
	});

	var NoteSchema = new Schema({
		_author		: { type: Schema.ObjectId, ref: 'Creator' }
	  , body		: String
	  ,	date		: { type: Date, default: Date.now }
	  , _event		: { type: Schema.ObjectId, ref: 'Event' }
	});

	// connect to database
	mongoose.connect(dbToUse);
	
	// define models
	var Note = mongoose.model('Note', NoteSchema);
	var Creator = mongoose.model('Creator', CreatorSchema);
	var Event = mongoose.model('Event', EventSchema);

	exports.Creator = Creator;
	exports.Event = Event;
	exports.Note = Note;
} 

exports.setup = setup;



function closeDB() {
	mongoose.disconnect();
}

exports.closeDB = closeDB;