var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairStatus', new Schema({
	plate: String,
    vehicleid: String,
    status: String,
    statusimg: String,
    statustype: String,
    nicetime: String,
	timestamp: String
}));
