
/**
 * Module dependencies.
 */

// base dependencies for app
var express = require('express')
  , routes = require('./routes')
  , DB = require('./accessDB').AccessDB
  , passport = require('passport');

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
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.session({ secret: 'applecake' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/login', function(req, res) {
  res.render('login.jade');
});

app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/account', 
    failureRedirect: '/login'
  })
);

app.get('/register', function(req, res) {
  res.render('register.jade');
});

app.get('/', function(req, res) {
  res.render('index.jade', { locals:
    { title: 'CrowdNotes' } 
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

app.get('/account', ensureAuthenticated, function(req, res) {
  db.getMyEvent(function(err, myEvent) {
    res.render('account.jade', { locals:
      { title: 'CrowdNotes' 
      , currentUser: req.user
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
          , currentUser: req.user
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
    res.redirect('/account');
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

app.post('/register', function(req, res) {
  db.saveUser({
    fname : req.param('name.first')
  , lname : req.param('name.last')
  , email : req.param('email')
  , password : req.param('password')
  }, function(err,docs) {
    res.redirect('/account');
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
    res.redirect('/account');
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

//mongooseAuth.helpExpress(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
