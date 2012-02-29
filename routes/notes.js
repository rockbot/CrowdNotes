// notes.js
// routing for notes-related pages

/* 
 * GET new note page
 */

module.exports = {


   getNewNote: function(req, res){
    db.getEvents(function(err, events) {
      db.getMyEvent(function(err, myEvent) {
        res.render('newNote.jade', { locals:
          { title: 'Write a Note!' 
          , myEvent: myEvent
          , currentEvents: events }
        });
      });
    });
  },

  postNewNote: function(req, res){
    db.saveNote({
      userid   : req.user.id
    , note     : req.param('note')
    , eventid  : req.param('eventid')
    }, function(err, docs) {
      console.log(req.user)
      res.redirect('/');  
    });
  },

  getMyNotes: function(req, res){
    db.getNotesFromUser(req.user.id, function(err, notes) {
      res.render('listNotes.jade', { locals:
        { title: "Notes I've written"
        , notesList: notes }
      });
    });
  },

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

  getEventNotes: function(req, res){
    db.getEvents(function(err, events) {
      res.render('eventNotes.jade', { locals:
        { title: 'Get all notes from an event'
        , currentEvents: events }
      });
    });
  },

  postEventNotes: function(req, res){
    db.getNotesFromEvent(req.param('eventid'), function(err, notes) {
      res.render('listNotes.jade', { locals: 
        { title: 'Event Notes!'
        , notesList : notes }
      });
    });
  },


  getUserNotes: function(req, res){
    db.getUsers(function(err, users) {
      res.render('userNotes.jade', { locals:
        { title: 'Get all notes from a user'
        , currentUsers: users }
      });
    });
  },

  postUserNotes: function(req, res){
    db.getNotesFromUser(req.param('userid'), function(err, notes) {
      res.render('listNotes.jade', { locals: 
        { title: 'User Notes!'
        , notesList : notes }
      });
    });
  }

};
