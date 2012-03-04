/** Note Schema for CrowdNotes **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema
var NoteSchema = new Schema({
    _user	: { type: Schema.ObjectId, ref: 'User' }
  , body	: String
  , date	: { type: Date, default: Date.now }
  , _event	: { type: Schema.ObjectId, ref: 'Event' }
});

module.exports = mongoose.model('Note', NoteSchema);
