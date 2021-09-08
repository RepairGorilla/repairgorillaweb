var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//list of inspection reports
module.exports = mongoose.model('jkwInspectionReport', new Schema({
	plate: String,
    vehicleid: String,
    inspectionstatus: String,
    inspectionid: String,
	timestamp: String
}));