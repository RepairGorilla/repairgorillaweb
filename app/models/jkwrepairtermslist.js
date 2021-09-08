var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('jkwRepairTermsList', new Schema({
    termsid: String,
    termstitle: String,
    termstext: String,
    timestamp: String,
    nicetime: String
}));