var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairCheckin', new Schema({
	plate: String,
    vehicleid: String,
    invoiceid: String,
    timestamp: String,
    nicetime: String
}));
