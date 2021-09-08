var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairChat', new Schema({
	plate: String,
	vehicleid: String,
	message: String,
	sentby: String,
	nicetime: String,
    timestamp: String
}));
