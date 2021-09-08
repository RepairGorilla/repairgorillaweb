var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('cmbWebPage', new Schema({
	name: String,
    filename: String,
    title: String,
    pageid: String,
    timestamp: String
}));
