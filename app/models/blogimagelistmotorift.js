var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('blogImageListchromemufflerbearing', new Schema({
	userid: String,
    username: String,
    imageurl: String,
    imageurlfull: String,
    statustitle: String,
    status: String,
    upvote: String,
    postid: String,
    timestampnice: String,
    timestamp: String
}));
