var mongoose = require('mongoose');
var Schema = mongoose.Schema;

    module.exports = mongoose.model('BlogSupportMessage', new Schema({
        messageid: String,
        messagesentby: String,
        messagesentto: String,
        messagethreaduser: String,
        messagesubject: String,
        message: String,
        imageurl: String,
        timestamp: String
    }));
