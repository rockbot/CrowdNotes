
/**
  * Module dependencies.
  */

//var everyauth = require('everyauth')
//  , Promise = everyauth.Promise;

/*
 * GET home page.
 */

module.exports = function(app, db, everyauth) {

  app.get('/', function(req, res){
    db.getMyEvent(function(err, myEvent) {
      res.render('index.jade', { locals:
        { title: 'CrowdNotes' 
        , myEvent: myEvent }
      });
    });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

};


