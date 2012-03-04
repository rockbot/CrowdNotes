// Module dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

// dependencies for authentication
//var everyauth = require('everyauth')
//  , Promise = everyauth.Promise;
//
//everyauth.debug = true;
//
//var mongooseAuth = require('mongoose-auth');

// dependencies for authentication
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var Event = require('./models/event');
var User = require('./models/user');
var Note = require('./models/note');

// connect to database
AccessDB = function(dbToUse) {
  mongoose.connect(dbToUse);
  // Check connection to mongoDB
  mongoose.connection.on('open', function() {
    console.log('We have connected to mongodb');
  }); 

  // Define class variable
  this.myEventID = null;
};

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

AccessDB.prototype.getMyEvent = function(callback) {
  Event.findOne({'_id': this.myEventID}, function(err, myEvent) {
    callback(null, myEvent);
  });
}

AccessDB.prototype.clearMyEvent = function(callback) {
  this.myEventID = null;
  callback(null);
}

// define prototypes
AccessDB.prototype.saveUser = function(userInfo, callback) {
  var newUser = new User ({
    name : userInfo.name
  , email: userInfo.email
  });

  newUser.save(function(err) {
    if (err) {throw err;}
    //console.log('Name: ' + newUser.name + '\nEmail: ' + newUser.email);
    callback(null, userInfo);
  });
};

AccessDB.prototype.saveEvent = function(eventInfo, callback) {
  var newEvent = new Event ({
    name : eventInfo.name
  , date : eventInfo.date
  , description : eventInfo.desc
  });

  newEvent.save(function(err) {
    if (err) {throw err;}
    //console.log('Name: ' + newEvent.name + '\nDate: ' + newEvent.date + '\nDesc: ' + newEvent.description);
    callback(null, eventInfo);
  });
};

AccessDB.prototype.saveNote = function(noteInfo, callback) {
  var newNote = new Note ({
      _user : noteInfo.userid
    , body    : noteInfo.note
    //, date    : Date.now
    , _event  : noteInfo.eventid
    });

  newNote.save(function (err) {
    if (err) {throw err;}
    //console.log('Name: ' + newNote._user + '\nNote: ' + newNote.body);
    callback(null, newNote);
  });
};

// disconnect from database
AccessDB.prototype.closeDB = function() {
	mongoose.disconnect();
}

AccessDB.prototype.getEvents = function(callback) {
  Event.find({},['name', '_id'], function(err, events) {
    callback(null, events);
  });
}

AccessDB.prototype.getUsers = function(callback) {
  User.find({}, ['name', '_id'], function(err, users) {
    callback(null, users);
  });
}

AccessDB.prototype.getNotesFromEvent = function(eventid, callback) {
  Note
  .find({'_event':eventid})
  .populate('_user')
  .populate('_event')
  .run(function(err, notes) {
    callback(null, notes);
  })
}

AccessDB.prototype.setEvent = function(eventid, callback) {
  this.myEventID = eventid;
  callback(null);
}

AccessDB.prototype.getNotesFromUser = function(userid, callback) {
  console.log('userid: ' + userid);
  Note
  .find({'_user':userid})
  .populate('_user')
  .populate('_event')
  .run(function(err, notes) {
    callback(null, notes);
  })
}

//everyauth.everymodule.findUserById( function(userId, callback) {
//  User.findById(userId,callback);
//});

exports.AccessDB = AccessDB;
