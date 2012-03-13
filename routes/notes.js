// notes.js
// routing for notes-related pages

var db = require('../accessDB');

/* 
 * GET new note page
 */

module.exports = {

  // app.get('/reviewNotes,...
  reviewNotes: function(req, res) {
    res.render('reviewNotes.jade');
  },

  // app.get('/newNote'...)
  getNewNote: function(req, res) {
    db.getMyEvent(function(err, myEvent) {
      //console.log('event: ' + myEvent);
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
  },

  // app.post('/newNote'...)
  postNewNote: function(req, res){
    db.saveNote({
      userid   : req.user.id
    , note     : req.param('note')
    , eventid  : req.param('eventid')
    }, function(err, docs) {
      //console.log(req.user)
      res.redirect('/newNote');  
    });
  },

  // app.get('/myNotes'...)
  getMyNotes: function(req, res){
    db.getNotesFromUser(req.user.id, function(err, notes) {
      res.render('listNotes.jade', { locals:
        { title: "Notes I've written"
        , notesList: notes }
      });
    });
  },

  // app.get('/myEventNotes'...)
  getMyEventNotes: function(req, res){
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
  },

  // app.get('/eventNotes'...)
  getEventNotes: function(req, res){
    db.getEvents('name', function(err, events) {
      res.render('eventNotes.jade', { locals:
        { title: 'Get all notes from an event'
        , currentEvents: events }
      });
    });
  },

  // app.post('/eventNotes'...)
  postEventNotes: function(req, res){
    db.getNotesFromEvent(req.param('eventid'), function(err, notes) {
      res.render('listNotes.jade', { locals: 
        { title: 'Event Notes!'
        , notesList : notes }
      });
    });
  },

  // app.get('/userNotes'...)
  getUserNotes: function(req, res){
    db.getUsers(function(err, users) {
      res.render('userNotes.jade', { locals:
        { title: 'Get all notes from a user'
        , currentUsers: users }
      });
    });
  },

  // app.post('/userNotes'...)
  postUserNotes: function(req, res){
    db.getNotesFromUser(req.param('userid'), function(err, notes) {
      res.render('listNotes.jade', { locals: 
        { title: 'User Notes!'
        , notesList : notes }
      });
    });
  }

};
