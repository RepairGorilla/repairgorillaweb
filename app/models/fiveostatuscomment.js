var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('fiveoStatusComment', new Schema({
	userid: String,
    username: String,
	comment: String,
    postid: String,
    commentid: String,
    timestamp: String
}));
