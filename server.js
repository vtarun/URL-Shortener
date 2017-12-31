const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UrlModel = require('./models/model');
const api = require('./routes/urlRoutes');
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://vtarun:password@ds037817.mlab.com:37817/vt-short-url');

var db = mongoose.connection;
db.on('error', function(err){
	console.log('MongoDB connection error:' + err);
})

app.use('/api', api);

app.get('/:shortedUrl', function(req, res){
	UrlModel.findOne({'shortUrl': req.params.shortedUrl}, function(err, result){
		if(err){
			return res.send('url invalid');
		}
		var re = new RegExp("^(http|https://)", 'i');
		var urlToCheck = result.originalUrl;
		if(re.test(urlToCheck)){
			res.redirect(301, result.originalUrl);
		}else{
			res.redirect(301, 'http://' + result.originalUrl);	
		}
		
	})	
})


app.listen(port, function(){
	console.log('listening to port '+ port);
})