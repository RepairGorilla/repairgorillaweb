var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairHour', new Schema({
	plate: String,
    vehicleid: String,
    techname: String,
    hours: String,
    hourprice: String,
    linetotal: String,
    desc: String,
    expected: String,
    invoiceid: String,
	timestamp: String
}));
