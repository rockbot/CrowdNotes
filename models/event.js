/** Event Schema for CrowdNotes **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema
var EventSchema = new Schema({
    name    	: String
  , date	: { type: Date, default: Date.now }
  , description : String
  , hashtag : String // need to verify it starts with '#'
});

module.exports = mongoose.model('Event', EventSchema);
