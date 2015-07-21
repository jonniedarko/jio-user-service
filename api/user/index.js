'use strict';

var express = require('express');

var router = express.Router();
var jwt = require('jsonwebtoken');

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
	router.get('/:id', function (req, res) {

		ctrl.getUserById(req.params.id)
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
		passport.authenticate('local-signup', function (err, user, info){
			if(err){
				res.status(status.SERVER_ERROR).end();
			} else if (!user) {
				res.status(status.BAD_REQUEST).json({err: 'Error'});
			}
			else {
				res.status(status.CREATED).json(user.toJSON());
			}
		})(req, res);

	});

	router.post('/Login', function(req, res, next){
		passport.authenticate('local-login', function (err, user, info){
			if(err){
				res.status(status.SERVER_ERROR).end();
			} else if (!user) {
				res.status(status.BAD_REQUEST).json({err: 'Error'});
			}
			else {
					res.status(status.OK).json(user.toJSON());
			}
		})(req, res, next);

	});
	return router;


}


