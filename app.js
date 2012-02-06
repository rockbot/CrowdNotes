
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , DB = require('./accessDB').AccessDB;

var app = module.exports = express.createServer();

var db = new DB('mongodb://localhost/CrowdNotes');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
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

app.get('/', routes.index);
app.get('/newUser', routes.newUser);
app.get('/newNote', function(req, res) {
  db.getEvents(function(err, events) {
    db.getCreators(function(err, users) {
      res.render('newNote.jade', { locals:
        { title: 'Write a Note!' 
        , currentEvents: events 
        , currentNames: users }
      });
    });
  });
});
app.get('/newEvent', function(req, res) {
 res.render('newEvent.jade', { locals:
  { title: 'Create an Event!' }
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
    username : req.param('username')
  , note     : req.param('note')
  }, function(err, docs) {
    res.redirect('/');  
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
