/*  CrowdNotes v0.0.1

		addNote.js
		Adds a new note to the system
	
    Raquel Velez
    10 Jan 2012 */

// Modules
var fs = require('fs');
var querystring = require('querystring');
var myDB = require('./accessDB');
var util = require('util');

// html to make the page look nice
var newNoteHTML = fs.readFileSync('views/post/newNote.html');

// respond to request for the page
function start(request, response, postNote) {
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  response.write(newNoteHTML);
  response.end();
}

function upload(request, response, postNote) {
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
		console.log("The Creator's name is %s", user.name);
	
		var note = new myDB.Note({
			_author : user._id
		, body		: noteInfo.note
		, date		: Date.now()
		, _event	: eventName._id
		})
		
		note.save(function(err) {
			if (err) {throw err;}
			console.log("The note reads: %s", note.body);
		})
	});
}


// export for use by app.js
exports.start = start;
exports.upload = upload;

function saveForLater() {
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
								
				}) // run query

				Note
				.findOne({ body : /super/i })
				.populate('_event')
				.run(function (err, note) {
					if (err) { 
						throw err; 
					}
					console.log('The w00t note was created at %s!', note._event.name);
				}) // run query


			}) // save note	
		}) // save author
	}) // save event
}