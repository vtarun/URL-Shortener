const express = require('express');
const mongoose = require('mongoose');
const UrlModel = require('../models/model');
var route = express.Router();

route.get('/:urlToShort(*)', function(req, res){
	var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	if(expression.test(req.params.urlToShort)){
		console.log(req.params.urlToShort);
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
		res.send({
			'originalUrl' : req.params.urlToShort,
			'shortedUrl'  : 'invalid'
		})
	}	
})


module.exports = route;