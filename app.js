
/**
 * Module dependencies.
 */

// base dependencies for app
var express = require('express')
  , routes = require('./routes')
  , DB = require('./accessDB').AccessDB
  , mongooseAuth = require('mongoose-auth');

var everyauth = require('everyauth')
  , Promise = everyauth.Promise;

everyauth.debug = true;

var app = module.exports = express.createServer();

var db = new DB('mongodb://localhost/CrowdNotes');

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
//  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'applecake' }));
  app.use(mongooseAuth.middleware());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res) {
  db.getMyEvent(function(err, myEvent) {
    res.render('index.jade', { locals:
      { title: 'CrowdNotes' 
      , myEvent: myEvent }
    });
  });
});

app.get('/newNote', function(req, res) {
  db.getMyEvent(function(err, myEvent) {
    console.log('event: ' + myEvent);
    if (myEvent) {
      db.getNotesFromEvent(myEvent.id, function(error, notes) { 
        res.render('newNote.jade', { locals:
          { title: 'Write a Note!' 
          , myEvent: myEvent
          , currentNotes: notes }
        });
      });
    }
    else {
      res.redirect('/setEvent');
    }
  });
});

app.get('/eventNotes', function(req, res) {
  db.getEvents(function(err, events) {
    res.render('eventNotes.jade', { locals:
      { title: 'Get all notes from an event'
      , currentEvents: events }
    });
  });
});

app.get('/myNotes', function(req, res) {
  db.getNotesFromUser(req.user.id, function(err, notes) {
    res.render('listNotes.jade', { locals:
      { title: "Notes I've written"
      , notesList: notes }
    });
  });
});

app.get('/userNotes', function(req, res) {
  db.getUsers(function(err, users) {
    res.render('userNotes.jade', { locals:
      { title: 'Get all notes from a user'
      , currentUsers: users }
    });
  });
});

app.get('/newEvent', function(req, res) {
 res.render('newEvent.jade', { locals:
  { title: 'Create an Event!' }
 });
});

app.get('/setEvent', function(req, res) {
  db.getEvents(function(err, events) {
    res.render('setEvent.jade', { locals:
      { title: 'Set my event'
      , currentEvents: events }
    });
    { title: 'Set my event' }
  });
});

app.post('/newEvent', function(req, res) {
  db.saveEvent({
    name : req.param('eventname')
  , date : req.param('eventdate')
  , desc : req.param('eventdesc')
  }, function(err, docs) {
    res.redirect('/');
  });
});

app.post('/newNote', function(req, res) {
  db.saveNote({
    userid   : req.user.id
  , note     : req.param('note')
  , eventid  : req.param('eventid')
  }, function(err, docs) {
    console.log(req.user)
    res.redirect('/newNote');  
  });
});

app.get('/myEventNotes', function(req, res) {
  db.getMyEvent(function(err, myEvent) {
    if (myEvent) {
      db.getNotesFromEvent(myEvent._id, function(err, notes) {
        res.render('listNotes.jade', { locals:
          { title: 'Notes from ' + myEvent.name
          , notesList : notes }
        });
      });
    } else {
      res.redirect('/eventNotes');  
    }
  });
});

app.get('/clearEvent', function(req, res) {
  db.clearMyEvent(function(err) {
    console.log('event cleared!');
    res.redirect('/');
  });
});

app.post('/eventNotes', function(req, res) {
  db.getNotesFromEvent(req.param('eventid'), function(err, notes) {
    res.render('listNotes.jade', { locals: 
      { title: 'Event Notes!'
      , notesList : notes }
    });
  });
});

app.post('/userNotes', function(req, res) {
  db.getNotesFromUser(req.param('userid'), function(err, notes) {
    res.render('listNotes.jade', { locals: 
      { title: 'User Notes!'
      , notesList : notes }
    });
  });
});

app.post('/setEvent', function(req, res) {
  db.setEvent(req.param('eventid'), function(err) {
    res.redirect('/newNote');
  });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

mongooseAuth.helpExpress(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
