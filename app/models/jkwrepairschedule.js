var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairSchedule', new Schema({
	plate: String,
    vehicleid: String,
    appointment: String,
    appointmenttime: String,
	timestamp: String
}));
