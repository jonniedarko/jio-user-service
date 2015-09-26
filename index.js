'use strict'

var passport = require('passport');
var userRoutes = require('./api/user');
var authRoutes = require('./api/auth');
var serviceClient;

if(process.env.REDIS){
	serviceClient = require('./mqtt.client')
}
else{
	serviceClient = require('./client');
}

module.exports = {
	init: function (app){
		app.use(function (req, res, next) {

			// Website you wish to allow to connect
			res.setHeader('Access-Control-Allow-Origin', '*');

			// Request methods you wish to allow
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

			// Request headers you wish to allow
			res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, Content-Type, Accept, X-Key, Authorization' );

			// Pass to next layer of middleware
			next();
		});

		var passportStrategy = require('./api/auth/auth.strategy');
		passportStrategy(passport);
		app.use(passport.initialize());

		app.use('/api/users/', userRoutes(passport));
		app.use('/api/authorise', authRoutes);

		return app;

	},

	service: serviceClient
};