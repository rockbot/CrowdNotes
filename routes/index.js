
/**
  * Module dependencies.
  */

//var everyauth = require('everyauth')
//  , Promise = everyauth.Promise;

/*
 * GET home page.
 */


module.exports = {

  index: function(req, res){
    db.getMyEvent(function(err, myEvent) {
      res.render('index.jade', { locals:
        { title: 'CrowdNotes'  
        , myEvent: myEvent }
      });
    });
  },

  logout: function(req, res){
    req.logout();
    res.redirect('/');
  }

};


