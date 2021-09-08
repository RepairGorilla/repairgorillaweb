var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// this is individually selected parts with a part condition that make up an inspection report
module.exports = mongoose.model('jkwInspectionPart', new Schema({
	plate: String,
    vehicleid: String,
    partdesc: String,
    partcondition: String,
    notes: String,
    photourl: String,
    inspectionid: String,
    partid: String,
	timestamp: String
}));