/*  CrowdNotes v0.0.1

		manageEvent.js
		Create, remove, and modify events in the system
	
    Raquel Velez
    13 Jan 2012 */

var myDB = require('./accessDB');
var fs = require('fs');
var querystring = require('querystring');

var createEventHTML = fs.readFileSync('views/post/createEvent.html');

function create(request, response, postEvent) {
	response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  response.write(createEventHTML);
  response.end();
}

function save(request, response, postEvent) {
	console.log(Object.keys(querystring.parse(postEvent)))

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write("You've saved the event " + querystring.parse(postEvent).eventname);
	response.end();

	var eventInfo = querystring.parse(postEvent);

	var newEvent = new myDB.Event({
		name : eventInfo.eventname
	, date : new Date(eventInfo.eventdate)	
	, description : eventInfo.eventdesc
	});
	
	newEvent.save(function(err) {
		if (err) {throw err;}
		console.log('Name: ' + newEvent.name + '\nDate: ' + newEvent.date 
								 + '\nDesc: ' + newEvent.description);
	})
}

exports.create = create;
exports.save = save;