var db = require('../accessDB');

module.exports = {

  // app.get('/newEvent'...)
  getNewEvent: function(req, res){
   res.render('newEvent.jade',
    { title: 'Create an Event!' }
   );
  },

  // app.post('/newEvent'...)
  postNewEvent: function(req, res){
    db.saveEvent({
      name : req.param('eventname')
    , date : new Date(req.param('eventyear'), req.param('eventmonth'), req.param('eventdate'))
    , desc : req.param('eventdesc')
    }, function(err, docs) {
      res.redirect('/account');
    });
  },

  // app.get('/setEvent'...)
  getSetEvent: function(req, res){
    db.getEvents('name', function(err, events) {
      res.render('setEvent.jade',
        { title: 'Set my event'
        , currentEvents: events }
      );
    });
  },

  // app.get('/setEvent/:id'...)
  setEventID: function(req, res){
    db.setEvent(req.params.id, function(err) {
      res.redirect('/newNote');
    });
  },

  // app.get('/sortEvents/:operation'...
  setEventSort: function(req, res) {
    db.getEvents(req.params.operation, function(err, events) {
      res.render('setEvent.jade',
        { title: 'Set My Event'
        , currentEvents: events }
      );
    });
  },

  // app.get('/clearEvent'...)
  clearEvent: function(req, res){
    db.clearMyEvent(function(err) {
      console.log('event cleared!');
      res.redirect('/account');
      res.redirect('/');
    });
  }

};
