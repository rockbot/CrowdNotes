// Module dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

// dependencies for authentication
var everyauth = require('everyauth')
  , Promise = everyauth.Promise;

everyauth.debug = true;

var mongooseAuth = require('mongoose-auth');

// connect to database
AccessDB = function(dbToUse) {
  mongoose.connect(dbToUse);
  // Check connection to mongoDB
  mongoose.connection.on('open', function() {
    console.log('We have connected to mongodb');
  }); 
};

// Define class variable
// !! Not sure if this is correct !!
var myEventID = null;

AccessDB.prototype.getMyEvent = function(callback) {
  Event.findOne({'_id': myEventID}, function(err, myEvent) {
    callback(null, myEvent);
  });
}

AccessDB.prototype.clearMyEvent = function(callback) {
  myEventID = null;
  callback(null);
}

// Define schema
var EventSchema = new Schema({
    name    	: String
  , date	: { type: Date, default: Date.now }
  , description : String
  , hashtag : String // need to verify it starts with '#'
});

var UserSchema = new Schema({})
  , User;

UserSchema.plugin(mongooseAuth, {
  everymodule: {
    everyauth: {
      User: function () {
        return User;
      }
    }
  }
, password: {
    loginWith: 'email'
  , extraParams: {
      name: {
        first: String
      , last: String 
      }
    }
  , everyauth: {
      getLoginPath: '/login'
    , postLoginPath: '/login'
    , loginView: 'login.jade'
    , getRegisterPath: '/register'
    , postRegisterPath: '/register'
    , registerView: 'register.jade'
    , loginSuccessRedirect: '/'
    , registerSuccessRedirect: '/'
    }
  }
});

var NoteSchema = new Schema({
    _user	: { type: Schema.ObjectId, ref: 'User' }
  , body	: String
  , date	: { type: Date, default: Date.now }
  , _event	: { type: Schema.ObjectId, ref: 'Event' }
});

// define models
var Note = mongoose.model('Note', NoteSchema);
User = mongoose.model('User', UserSchema);
var Event = mongoose.model('Event', EventSchema);

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
  myEventID = eventid;
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

everyauth.everymodule.findUserById( function(userId, callback) {
  User.findById(userId,callback);
});

exports.AccessDB = AccessDB;
