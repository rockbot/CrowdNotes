var mongoose = require('mongoose');

// connect to database
AccessDB = function(dbToUse) {
  mongoose.connect(dbToUse);
  console.log('We have connected to mongodb');
};

// Check connection to mongoDB
var	Schema = mongoose.Schema;

// Define schema
var EventSchema = new Schema({
    name    	: String
  , date	: { type: Date, default: Date.now }
  , description : String
  , notes	: [{ type: Schema.ObjectId, ref: 'Note' }]
});

var CreatorSchema = new Schema({
    name	: String
  , email	: String 
  , notes	: [{ type: Schema.ObjectId, ref: 'Note' }]
});

var NoteSchema = new Schema({
    _author	: { type: Schema.ObjectId, ref: 'Creator' }
  , body	: String
  , date	: { type: Date, default: Date.now }
  , _event	: { type: Schema.ObjectId, ref: 'Event' }
});

// define models
var Note = mongoose.model('Note', NoteSchema);
var Creator = mongoose.model('Creator', CreatorSchema);
var Event = mongoose.model('Event', EventSchema);

AccessDB.prototype.saveEvent = function(eventInfo, callback) {
  var newEvent = new Event ({
    name : eventInfo.name
  , date : eventInfo.date
  , description : eventInfo.desc
  });

  newEvent.save(function(err) {
    if (err) {throw err;}
    console.log('Name: ' + newEvent.name + '\nDate: ' + newEvent.date + '\nDesc: ' + newEvent.description);
    callback(null, eventInfo);
  });
};

AccessDB.prototype.saveNote = function(noteInfo, callback) {
  var newNote = new Note ({
      _author : noteInfo.username
    , body    : noteInfo.note
    , date    : Date.now
    , _event  : 'BarCamp 7'
    });

  newNote.save(function (err) {
    if (err) {throw err;}
    console.log('Name: ' + newNote._author + '\nNote: ' + newNote.body);
  });
};

// disconnect from database
AccessDB.prototype.closeDB = function() {
	mongoose.disconnect();
}

AccessDB.prototype.getEvents = function(callback) {
  Event.find({},['name', '_id'], function(err, events) {
    callback(null, events);
  })
}

exports.AccessDB = AccessDB;
