var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
	ShortUrl:    String,
	OriginalUrl: String,
});

var conn  = mongoose.createConnection('mongodb://127.0.0.1/surl');
var surl  = conn.model('surl', urlSchema);

module.exports = surl;
