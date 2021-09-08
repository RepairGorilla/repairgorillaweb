var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// this is individually selected parts with a part condition that make up an inspection report
    module.exports = mongoose.model('jkwInspectionPartList', new Schema({
        listid:String,
        partid:String,
        part: String,
        timestamp: String
    }));
