var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairReason', new Schema({
	plate: String,
    vehicleid: String,
    whatswrong: String,
    howtofix: String,
	timestamp: String
}));
