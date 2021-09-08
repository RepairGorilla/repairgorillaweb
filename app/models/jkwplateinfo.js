var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwPlateInfo', new Schema({
	plate: String,
	vehicleid: String,
	timestamp: String
}));
