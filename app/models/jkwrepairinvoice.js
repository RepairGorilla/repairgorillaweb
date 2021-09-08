var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairInvoice', new Schema({
	plate: String,
    vehicleid: String,
    invoicestatus: String,
    typeof: String,
    workdesc: String,
    expecteddate: String,
    isnorepaircost: String, // is this invoice the cost to reassemble without repair
    invoiceid: String,
    invoicesignature: String, // signature of who prepared the invoice
    invoiceodometer: String,
    invoiceyearmake: String,
    invoiceaddress: String,
    invoicecustomername: String,
    invoiceregistrationnumber: String,
    approvalstatus: String,
    approvalid: String,
    timestamp: String,
    nicetime: String
}));
