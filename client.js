'use strict';
var q = require('q');
var userCtrl = require('./api/user/user.controller');

function getUser(id) {
	var deferred = q.defer();

	userCtrl.getUserById(id)
		.then(function(user){
			deferred.resolve({user:user});
		})
		.catch(function(err){
			deferred.reject({'Error': err});
		});
	return deferred.promise;
}
module.exports = {
	isServiceAvailable: function() {
		return true;
	},
	getUser	: getUser
};