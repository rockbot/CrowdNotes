// Module dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

// dependencies for authentication
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var Event = require('./models/event');
var User = require('./models/user');
var Note = require('./models/note');

// Define local strategy for Passport
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    User.authenticate(email, password, function(err, user) {
      return done(err, user);
    });
  }
));
      
// serialize user on login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// deserialize user on logout
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// connect to database
module.exports = {
  // Define class variable
  myEventID: null,

  // initialize DB
  startup: function(dbToUse) {
    mongoose.connect(dbToUse);
    // Check connection to mongoDB
    mongoose.connection.on('open', function() {
      console.log('We have connected to mongodb');
    }); 

  },

  // get user's selected event
  getMyEvent: function(callback) {
    Event.findOne({'_id': this.myEventID}, function(err, myEvent) {
      callback(null, myEvent);
    });
  },

  // clear user's selected event
  clearMyEvent: function(callback) {
    this.myEventID = null;
    callback(null);
  },

  // save a user
  saveUser: function(userInfo, callback) {
    //console.log(userInfo['fname']);
    var newUser = new User ({
      name : { first: userInfo.fname, last: userInfo.lname }
    , email: userInfo.email
    //, password: userInfo.password
    }).setPassword(userInfo.password, function(newUser) {
      newUser.save(function(err) {
        if (err) {throw err;}
        //console.log('Name: ' + newUser.name + '\nEmail: ' + newUser.email);
        callback(null, userInfo);
      });
    });
  },

  // save an event
  saveEvent: function(eventInfo, callback) {
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
  },

  // save a note
  saveNote: function(noteInfo, callback) {
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
  },

  // disconnect from database
  closeDB: function() {
    mongoose.disconnect();
  },

  // get all the events
  getEvents: function(sortby, callback) {
    var query = Event.find({},'name date _id');
    query.sort(sortby);
    query.exec(function(err, events) {
      callback(null, events);
    });
  },

  // get all the users
  getUsers: function(callback) {
    User.find({}, 'name _id', function(err, users) {
      callback(null, users);
    });
  },

  // get all the notes from a specific event
  getNotesFromEvent: function(eventid, callback) {
    Note
    .find({'_event':eventid})
    .populate('_user')
    .populate('_event')
    .exec(function(err, notes) {
      callback(null, notes);
    })
  },

  // set the event
  setEvent: function(eventid, callback) {
    this.myEventID = eventid;
    callback(null);
  },

  // get the notes from a specific user
  getNotesFromUser: function(userid, callback) {
    console.log('userid: ' + userid);
    Note
    .find({'_user':userid})
    .populate('_user')
    .populate('_event')
    .exec(function(err, notes) {
      callback(null, notes);
    })
  }

}

