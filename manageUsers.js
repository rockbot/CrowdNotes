/*  CrowdNotes v0.0.1

		manageUsers.js
		Create, remove, and modify users/note-takers in the system
	
    Raquel Velez
    13 Jan 2012 */

var myDB = require('./accessDB');
var fs = require('fs');
var querystring = require('querystring');

var createUserHTML = fs.readFileSync('views/post/createUser.html');

function create(request, response, postUser) {
	response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  response.write(createUserHTML);
  response.end();
}

function save(request, response, postUser) {
	//console.log(Object.keys(querystring.parse(postEvent)))

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write("You've saved the user " + querystring.parse(postUser).username);
	response.end();

	var userInfo = querystring.parse(postUser);

	var newUser = new myDB.Creator({
		name  : userInfo.username
	, email : userInfo.useremail
	});
	
	newUser.save(function(err) {
		if (err) {throw err;}
		console.log('Name: ' + newUser.name + '\nEmail: ' + newUser.email);
	})
}

exports.create = create;
exports.save = save;
