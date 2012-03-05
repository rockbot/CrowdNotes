
/**
 * Module dependencies.
 */

// base dependencies for app
var express = require('express')
  , routes = require('./routes')
  , DB = require('./accessDB').AccessDB
  , passport = require('passport')
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongodb');

var app = module.exports = express.createServer();
global.app = app;

var DB = require('./accessDB');
var conn = 'mongodb://localhost/CrowdNotes';
var db;

//var io = require('socket.io').listen(app);
//
//io.sockets.on('connection', function(socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.session({ 
    store: mongoStore(conn)
  , secret: 'applecake'
  }, function() {
    app.use(app.router);
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));
});

db = new DB.startup(conn);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
require('./routes')(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
