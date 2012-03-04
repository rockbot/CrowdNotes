/** User Schema for CrowdNotes **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passport = require('passport');
var bcrypt = require('bcrypt');

// Define schema
var UserSchema = new Schema({
    name : { 
        first: { type: String, required: true } 
      , last: { type: String, required: true }
    }
  , email: { type: String, unique: true }
  , salt: { type: String, required: true }
  , hash: { type: String, required: true }
});


UserSchema
.virtual('password')
.get(function() {
  return this.__password;
})
.set(function(password) {
  this.__password = password;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      this.set('salt', salt);
      this.set('hash', hash);
    });
  });
});

//UserSchema.plugin(mongooseAuth, {
//  everymodule: {
//    everyauth: {
//      User: function () {
//        return User;
//      }
//    }
//  }
//, password: {
//    loginWith: 'email'
//  , extraParams: {
//      name: {
//        first: String
//      , last: String 
//      }
//    }
//  , everyauth: {
//      getLoginPath: '/login'
//    , postLoginPath: '/login'
//    , loginView: 'login.jade'
//    , getRegisterPath: '/register'
//    , postRegisterPath: '/register'
//    , registerView: 'register.jade'
//    , loginSuccessRedirect: '/'
//    , registerSuccessRedirect: '/'
//    }
//  }
//});

module.exports = mongoose.model('User', UserSchema);
