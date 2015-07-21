'use strict';
var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../user/user.model');
var jwt = require('jsonwebtoken');

module.exports = passportConfig;

function passportConfig(passport) {
	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},
		function (req, email, password, done) {
			// asynchronous
			// User.findOne wont fire unless data is sent back
			process.nextTick(function () {
				// find a user whose email is the same as the forms email
				// we are checking to see if the user trying to login already exists
				UserModel.findOne({'email': email}, function (err, user) {

					// if there are any errors, return the error
					if (err)
						return done(err);

					// check to see if theres already a user with that email
					if (user) {
						return done(null, false);
					} else {

						// if there is no user with that email
						// create the user
						var newUser = new UserModel();

						// set the user's local credentials
						newUser.email = email;
						newUser.password = newUser.generateHash(password);
						newUser.name = req.body.name;
						newUser.token = jwt.sign(newUser, process.env.JWT_SECRET);

						// save the user
						newUser.save(function (err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}

				});

			});

		}));

	passport.use('local-login', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},
		function (req, email, password, done) { // callback with email and password from our form
			// asynchronous
			// User.findOne wont fire unless data is sent back
			process.nextTick(function () {
				// find a user whose email is the same as the forms email
				// we are checking to see if the user trying to login already exists
				UserModel.findOne({'email': email}, function (err, user) {
					// if there are any errors, return the error before anything else
					if (err) {
						return done(err);
					}

					// if no user is found or if the user is found but
					// the password is wrong, return the message
					if (!user || !user.comparePassword(password)) {
						return done(null, false);
					}

					// all is well, return successful user
					return done(null, user);
				});
			})
		}));
	return passport;

}