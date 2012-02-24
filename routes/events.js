var everyauth = require('everyauth')
  , Promise = everyauth.Promise;

module.exports = function(app, db) {

  app.get('/newEvent', function(req, res){
   res.render('newEvent.jade', { locals:
    { title: 'Create an Event!' }
   });
  });

  app.post('/newEvent', function(req, res){
    db.saveEvent({
      name : req.param('eventname')
    , date : req.param('eventdate')
    , desc : req.param('eventdesc')
    }, function(err, docs) {
      res.redirect('/');
    });
  });

  app.get('/setEvent', function(req, res){
    db.getEvents(function(err, events) {
      res.render('setEvent.jade', { locals:
        { title: 'Set my event'
        , currentEvents: events }
      });
      { title: 'Set my event' }
    });
  });

  app.post('/setEvent', function(req, res){
    db.setEvent(req.param('eventid'), function(err) {
      res.redirect('/newNote');
    });
  });

  app.get('/clearEvent', function(req, res){
    db.clearMyEvent(function(err) {
      console.log('event cleared!');
      res.redirect('/');
    });
  });

};
