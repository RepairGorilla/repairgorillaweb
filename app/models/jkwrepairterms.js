var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairTerms', new Schema({
	plate: String,
    vehicleid: String,
    termsid: String,
    termstext: String,
    termstitle: String,
    approvalstatus: String,
    approvalsignature: String,
    approvalid: String,
    invoiceid: String,
    timestamp: String,
    nicetime: String
}));