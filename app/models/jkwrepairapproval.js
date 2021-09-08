var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairApproval', new Schema({
	plate: String,
    vehicleid: String,
    invoiceid: String,
    approvalstatus: String,
    approvalsignature: String,
    approvalid: String,
    waiverid: String,
    timestamp: String,
    nicetime: String
}));
