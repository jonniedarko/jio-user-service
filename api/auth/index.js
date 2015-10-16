'use strict';
var passport = require('passport');
var express = require('express');
var auth = require('jio-node-auth')();
var router = express.Router();

var ctrl = require('./auth.controller');

router.get('/verify', function (req, res){
	var headers = req.headers;
	if (headers == null) return res.send(401);

	// Get token
	try {
		var token = auth.extractTokenFromHeader(headers);
	} catch (err) {
		console.log(err);
		return res.status(200).json({isLoggedIn: false});
	}

	auth.isTokenValid(token, function (err, isValid) {
		if (err || !isValid) {
			res.status(200).json({isLoggedIn: false});
		}else {
			res.status(200).json({isLoggedIn: true});
		}
	});

});
module.exports = router;

