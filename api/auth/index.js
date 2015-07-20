'use strict';
var passport = require('passport');
var express = require('express');
var router = express.Router();

//var ctrl = require('./auth.controller');

router.post('/', function (req, res){
	console.log('req.body', req.body);
	res.status(200).json({isAuthorised:true});

});
module.exports = router;

