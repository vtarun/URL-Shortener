const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UrlSchema = new Schema({
	originalUrl : String,
	shortUrl : String
});

var UrlModel = mongoose.model('UrlModel', UrlSchema);

module.exports = UrlModel;