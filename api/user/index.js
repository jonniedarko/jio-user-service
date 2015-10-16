'use strict';

var express = require('express');
var auth = require('jio-node-auth')();

var router = express.Router();
var jwt = require('jsonwebtoken');
var USER_ID_HEADER_KEY = 'x-key';

var ctrl = require('./user.controller');

var status = {
	CREATED : 201,
	NON_CONTENT: 204,
	OK: 200,
	SERVER_ERROR: 500,
	BAD_REQUEST: 400,
	NOT_AUTHORISED: 401
};

module.exports = setupRoutes;

function setupRoutes(passport) {
	// get /:id
	router.get('/:id', auth.verify, function (req, res) {
		var userID =
			req.params.id === 'me'?
				req.headers[USER_ID_HEADER_KEY] : req.params.id;

		ctrl.getUserById(userID)
			.then(function (user) {
				if (user) {
					res.status(status.OK).json(user);
				} else {
					res.status(status.BAD_REQUEST).json({err: 'Error'});
				}
			})
			.catch(function (err) {
				res.status(500).end();
			});

	});

	router.get('/', function (req, res) {

		ctrl.getUserByEmail(req.query.email)
			.then(function (user) {
				if (user) {
					res.status(status.OK).json(user);
				} else {
					res.status(status.BAD_REQUEST).json({err: 'Error'});
				}
			})
			.catch(function (err) {
				res.status(500).end();
			});

	});

	// get /
	router.post('/signUp', function (req, res) {
		console.log('cookie', req.cookie);
		passport.authenticate('local-signup', function (err, userData, info){
			if(err){
				res.status(status.SERVER_ERROR).end();
			} else if (!userData) {
				res.status(status.BAD_REQUEST).json({err: 'Error'});
			}
			else {
				res.status(status.CREATED).json(userData);
			}
		})(req, res);

	});

	router.post('/Login', function(req, res, next){
		passport.authenticate('local-login', function (err, userData, info){
			if(err){
				res.status(status.SERVER_ERROR).end();
			} else if (!userData) {
				res.status(status.BAD_REQUEST).json({err: 'Error'});
			}
			else {
					res.status(status.OK).json(userData);
			}
		})(req, res, next);

	});
	return router;


}


