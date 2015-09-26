'use strict';
var mqtt = require('mqtt');
var q = require('q');
var ServiceRegistry = require('../../serviceRegistery');

var broker = 'localhost';
var port = 1883;

var topic = '/api/users/';
//(port, broker);
var message = {
	event: '/api/users/',
	state: {
		id: '55a8ef1ed6ffe3db3e63c1c9'
	}
};
var userServiceTopic;
var serviceRegistry = ServiceRegistry();
serviceRegistry.discoverService('/UserService')
	.then(function(serviceInfo){
		//console.log('serviceInfo', serviceInfo.value);
		userServiceTopic = serviceInfo.value.topic;
		serviceInfo.watcher
			.on('change', function (data) {
				//console.log('Value changed; new value: ', data);
				userServiceTopic = JSON.parse(data.node.value).topic
			})
			.on('expire', function (data) {
				console.log('Value expired.');
				userServiceTopic = null;
			})
			.on('delete', function (data) {
				console.log('Value deleted.');
				userServiceTopic = null;
			});
	}).catch(function (err){
		console.log('err', err);
	})


function getUser(id) {
	var deferred = q.defer();
	console.log('serviceRegistry.check(userServiceTopic)');

	var topic = '/api/users/' + id + '/';
	var client = mqtt.connect('mqtt://localhost:' + port);
	var message = {
		event: topic,
		state: {
			id: id
		}
	};
	var payload = JSON.stringify(message);

	client.subscribe(topic);
	client.on('message', function (messageTopic, message) {
		if (messageTopic === topic) {

			console.log('returned message', JSON.parse(message));
			client.end(topic);
			deferred.resolve({user:JSON.parse(message)})

		}
	});
	client.on('error', function (err) {
		client.end(topic);
		deferred.reject({'Error': err});
	});
	client.publish('/api/users/*/', payload, function () {
		console.log('[API REQ] Message published to the topic', topicId, payload);
	});

	return deferred.promise;
}
module.exports = {
	isServiceAvailable: function() {
		return serviceRegistry.checkService('/UserService');
	},
	getUser	: getUser
};