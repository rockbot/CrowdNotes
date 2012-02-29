
/**
 * Module dependencies.
 */

// base dependencies for app
var express = require('express')
  , mongooseAuth = require('mongoose-auth');

//var everyauth = require('everyauth')
//  , Promise = everyauth.Promise;
//
//everyauth.debug = true;

var app = module.exports = express.createServer();
global.app = app;

var DB = require('./accessDB').AccessDB;
var conn = 'mongodb://localhost/CrowdNotes';
var db = new DB(conn);

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
  app.set('db', conn); 
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
require('./routes')(app);

mongooseAuth.helpExpress(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
