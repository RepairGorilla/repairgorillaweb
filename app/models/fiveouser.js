var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('FiveoUser', new Schema({
	name: String,
	password: String,
    email: String,
	myid: String,
	fireid: String,
    level: String,
	lastreup: String,
	reup: String,
	expires: String,
	admin: Boolean
}));
