var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwCarInfo', new Schema({
	plate: String,
	vehicleid: String,
	year: String,
	make: String,
    model: String,
    vin: String,
	timestamp: String,
	nicetime: String
}));
