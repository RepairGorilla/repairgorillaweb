var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('cmbWebSection', new Schema({
	name: String,
    sectiontype: String,
    sectionfilename: String,
    nextsection: String,
    sectionorder: String,
    sectionid: String,
    pageid: String,
    timestamp: String
}));
