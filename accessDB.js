// Module dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

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
    usernameField: 'email'
  },
  function(email, password, done) {
    User.authenticate(email, password, function(err, user) {
      return done(err, user);
    });
  }
));
      
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

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
  //console.log(userInfo['fname']);
  var newUser = new User ({
    name : { first: userInfo.fname, last: userInfo.lname }
  , email: userInfo.email
  , password: userInfo.password
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

exports.AccessDB = AccessDB;
