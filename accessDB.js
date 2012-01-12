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

	
	var AuthorSchema = new Schema({
		name	: String
	  , email	: String 
	  , notes	: [{ type: Schema.ObjectId, ref: 'Note' }]
	});

	var NoteSchema = new Schema({
		_author		: { type: Schema.ObjectId, ref: 'Author' }
	  , body		: String
	  ,	date		: { type: Date, default: Date.now }
	  , _event		: { type: Schema.ObjectId, ref: 'Event' }
	});

	// connect to database
	mongoose.connect(dbToUse);
	
	// define models
	var Note = mongoose.model('Note', NoteSchema);
	var Author = mongoose.model('Author', AuthorSchema);
	var Event = mongoose.model('Event', EventSchema);


	// Sandbox Area
	
	// start with a new event
	var barcamp = new Event({ 
		name 		: 'BarCamp 7'
	  , date		: new Date('04/28/2012')
	  , description : 'Best unconference EVAR' 
	});

	barcamp.save(function(err) {
		if (err) { throw err; }
		console.log('saved event');

		var raquel = new Author({ 
			name	: 'Raquel' 
		  , email	: 'raquel.velez@gmail.com' 
		});
	

		raquel.save(function(err) {
			if (err) { throw err; }
			console.log('saved author');
	
			var note = new Note({
			    body	 	: 'super cool note - w00t!'
			  ,	_author		: raquel._id
			  , date		: Date.now()
			  , _event	 	: barcamp._id
			});
	
			note.save(function(err) {
				if (err) { throw err; }
				console.log('saved note');

				Note
				.findOne({ body : /super/i })
				.populate('_author')
				.run(function (err, note) {
					if (err) { 
						throw err; 
					}
					console.log('The creator of the w00t note is %s!', note._author.name);
									
					mongoose.disconnect();
				}) // run query

				Note
				.findOne({ body : /super/i })
				.populate('_event')
				.run(function (err, note) {
					if (err) { 
						throw err; 
					}
					console.log('The w00t note was created at %s!', note._event.name);
									
					mongoose.disconnect();
				}) // run query


			}) // save note	
		}) // save author
	}) // save event
		
	console.log('boom!');
		

} 

exports.setup = setup;

function makeDinner(function buyGroceries() {
	// get the chicken, pasta, and veggies
}) {
	// use ingredients to make dinner
}

var ingredients = 