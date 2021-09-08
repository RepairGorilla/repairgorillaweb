var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairWaiverList', new Schema({
    waiverid: String,
    waivertitle: String,
    waivertext: String,
    timestamp: String,
    nicetime: String
}));