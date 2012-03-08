
/** routes.js
  */

var passport = require('passport');

var start = require('./routes/index');
var notes = require('./routes/notes');
var events = require('./routes/events');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = function(app) {

  app.get('/', start.index);

  app.get('/register', start.getRegister);
  app.post('/register', start.postRegister);

  app.get('/about', start.about);

  app.get('/login', start.login);
  app.post('/login', passport.authenticate('local', 
    { 
      successRedirect: '/account', 
      failureRedirect: '/login'
    })
  );

  app.get('/account', ensureAuthenticated, start.getAccount);

  app.get('/logout', start.logout);

  app.get('/reviewNotes', notes.reviewNotes);

  app.get('/newNote', notes.getNewNote);
  app.post('/newNote', notes.postNewNote);
  
  app.post('/myNotes', notes.getMyNotes);
  
  app.get('/myEventNotes', notes.getMyEventNotes);

  app.get('/eventNotes', notes.getEventNotes);
  app.post('/eventNotes', notes.postEventNotes);

  app.get('/userNotes', notes.getUserNotes);
  app.post('/userNotes', notes.postUserNotes);

  app.get('/newEvent', events.getNewEvent);
  app.post('/newEvent', events.postNewEvent);

  app.get('/setEvent', events.getSetEvent);
  app.post('/setEvent', events.postSetEvent);

  app.get('/clearEvent', events.clearEvent);  
}
