var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairPart', new Schema({
	plate: String,
    vehicleid: String,
    partcondition: String,
    partnumber: String,
    part: String,
    partprice: String,
    partcount: String,
    linetotal: String,
    expected: String,
    invoiceid: String,
	timestamp: String
}));
