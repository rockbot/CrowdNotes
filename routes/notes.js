// notes.js
// routing for notes-related pages

/* 
 * GET new note page
 */

module.exports = function(app, db) {


  app.get('/newNote', function(req, res){
    db.getEvents(function(err, events) {
      db.getMyEvent(function(err, myEvent) {
        res.render('newNote.jade', { locals:
          { title: 'Write a Note!' 
          , myEvent: myEvent
          , currentEvents: events }
        });
      });
    });
  });

  app.post('/newNote', function(req, res){
    db.saveNote({
      userid   : req.user.id
    , note     : req.param('note')
    , eventid  : req.param('eventid')
    }, function(err, docs) {
      console.log(req.user)
      res.redirect('/');  
    });
  });

  app.get('/myNotes', function(req, res){
    db.getNotesFromUser(req.user.id, function(err, notes) {
      res.render('listNotes.jade', { locals:
        { title: "Notes I've written"
        , notesList: notes }
      });
    });
  });

  app.get('/myEventNotes', function(req, res){
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

  app.get('/eventNotes', function(req, res){
    db.getEvents(function(err, events) {
      res.render('eventNotes.jade', { locals:
        { title: 'Get all notes from an event'
        , currentEvents: events }
      });
    });
  });

  app.post('/eventNotes', function(req, res){
    db.getNotesFromEvent(req.param('eventid'), function(err, notes) {
      res.render('listNotes.jade', { locals: 
        { title: 'Event Notes!'
        , notesList : notes }
      });
    });
  });


  app.get('/userNotes', function(req, res){
    db.getUsers(function(err, users) {
      res.render('userNotes.jade', { locals:
        { title: 'Get all notes from a user'
        , currentUsers: users }
      });
    });
  });

  app.post('/userNotes', function(req, res){
    db.getNotesFromUser(req.param('userid'), function(err, notes) {
      res.render('listNotes.jade', { locals: 
        { title: 'User Notes!'
        , notesList : notes }
      });
    });
  });

};
