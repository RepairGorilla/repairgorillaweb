var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairWaiver', new Schema({
	plate: String,
    vehicleid: String,
    waiverid: String,
    waivertext: String,
    waivertitle: String,
    approvalstatus: String,
    approvalsignature: String,
    approvalid: String,
    timestamp: String,
    nicetime: String
}));