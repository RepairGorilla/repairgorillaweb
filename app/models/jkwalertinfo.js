var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwAlertInfo', new Schema({
	plate: String,
	vehicleid: String,
	name: String,
	phone: String,
    email: String,
	alerttype: String,
	nicetime: String,
	timestamp: String
}));
