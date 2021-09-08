var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairDoneDate', new Schema({
	plate: String,
    vehicleid: String,
    invoiceid: String,
    donedate: String,
    timestamp: String,
    nicetime: String
}));