
/**
  * Module dependencies.
  */
var db = require('../accessDB');

module.exports = {

  // app.get('/'...)
  index: function(req, res) {
    res.render('index.jade',
      { title: 'CrowdNotes' }
    );
  },

  // app.get('/register'...)
  getRegister: function(req, res) {
    res.render('register.jade', { title: "Register" });
  },

  // app.post('/register'...)
  postRegister: function(req, res) {
    db.saveUser({
      fname : req.param('name.first')
    , lname : req.param('name.last')
    , email : req.param('email')
    , password : req.param('password')
    }, function(err,docs) {
      res.redirect('/account');
    });
  },

  // app.get('/about', ...
  about: function(req, res) {
    res.render('about.jade', {title: "About Us"});
  },

  // app.get('/login', ...
  login: function(req, res) {
    res.render('login.jade', {title: "Please Login"});
  },

  // app.get('/account', ensureAuthenticated, ...
  getAccount: function(req, res) {
    db.getMyEvent(function(err, myEvent) {
      res.render('account.jade',
        { title: 'CrowdNotes' 
        , currentUser: req.user
        , myEvent: myEvent }
      );
    });
  },

  // app.get('/logout'...)
  logout: function(req, res){
    req.logout();
    res.redirect('/');
  }

};


