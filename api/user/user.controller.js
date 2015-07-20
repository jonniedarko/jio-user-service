'use strict';
var User = require('./user.model');
var q = require('q');

module.exports = {
	createUser: createUser,
	getUserById: getUserById,
	getUserByEmail: getUserByEmail
};

function createUser(userDetails) {
	var deferred = q.defer();

	if (!userDetails.email || !userDetails.password) {
		deferred.reject('missing required fields');
	}

	var user = new User();
	user.email = userDetails.email;
	user.password = userDetails.password;
	user.name = userDetails.name;

	user.save(function (err, usr) {

		if (err) {
			deferred.reject(err);
		}

		deferred.resolve(usr.toJSON());

	});
	return deferred.promise;
}

function getUserById(id) {
	var deferred = q.defer();
	if (!id) {
		deferred.reject('requires an email or id')
	}

	User.findById(id)
		.exec(function (err, usr) {
			if (err) {
				deferred.reject(err);
			}
			else if (!usr) {
				deferred.reject('user not found')
			}
			else {
				deferred.resolve(usr.toJSON());
			}
		})
	return deferred.promise;
}

function getUserByEmail(email) {
	var deferred = q.defer();
	if (!email) {
		deferred.reject('requires an email or id')
	}
	User.find({email: email})
		.exec(function (err, users) {
			if (err) {
				deferred.reject(err);
			}
			else if (!users || !users[0]) {
				deferred.reject('user not found')
			}
			else {
				var usr = users[0];
				deferred.resolve(usr.toJSON());
			}
		});
	return deferred.promise;
};
