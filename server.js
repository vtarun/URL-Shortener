const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UrlModel = require('./models/model');
//const api = require('./routes/urlRoutes');
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://vtarun:password@ds037817.mlab.com:37817/vt-short-url');

var db = mongoose.connection;
db.on('error', function(err){
	console.log('MongoDB connection error:' + err);
})

//app.use('/api', api);

app.get('/api/:urlToShort(*)', function(req, res, next){
	var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	if(expression.test(req.params.urlToShort)){		
		var shortedUrl = Math.floor(Math.random() * 1000000).toString();

		var data = new UrlModel({
			'originalUrl' : req.params.urlToShort,
			'shortUrl'  : shortedUrl
		});

		data.save(function(err){
			if(err){
				return res.send('error saving to database');
			}
		});
		res.json(data);
	}else{		
		res.json({
			'originalUrl': req.params.urlToShort,
			'shortedUrl': 'invalid'
		})
	}	
});

app.get('/:forwardUrl', function(req, res){
	UrlModel.findOne({'shortUrl': req.params.forwardUrl}, function(err, results){		
		if(err){
			return res.send('url invalid');
		}
		console.log(results);
		var re = new RegExp("^(http|https://)", 'i');
		var urlToCheck = results.originalUrl;
		if(re.test(urlToCheck)){
			res.redirect(301, results.originalUrl);
		}else{
			res.redirect(301, 'http://' + results.originalUrl);	
		}
		
	})	
})


app.listen(port, function(){
	console.log('listening to port '+ port);
})