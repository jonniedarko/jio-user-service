var mqtt = require('mqtt');
var config = require('../config');
var ctrl = require('../../api/user/user.controller');

var GET_USER_BY_ID = '/api/users/*/';

module.exports = function (topicUrl) {
	console.log('Service started');
	var topic = 'get/user';
	var client = mqtt.connect(config.brokerUrl);

	client.subscribe(GET_USER_BY_ID);
	client.on('message', function (topic, message) {
			console.log('message user', message);
			console.log('topic user', topic);
			if (topic === GET_USER_BY_ID) {
				getUserById(topicUrl, message, client);
			}
		});

};

// get by '/api/users/:id/'
function getUserById(topicUrl, message, client){
	var payload = JSON.parse(message);
	console.log('topic user', payload);
	ctrl.getUserById(payload.state.id)
		.then(function (user) {
			if (user) {
				console.log('message user', user);
				client.publish(topicUrl + user._id+'/', JSON.stringify(user))
			} else {
				console.log('message no user');
				client.publish(topicUrl + user._id+'/', JSON.stringify({err: 'no user'}))
			}
		})
		.catch(function (err) {
			console.log('message err: ', err);
			client.publish(topicUrl + user._id+'/', JSON.stringify({err: err}))
		});

};

// get list by '/api/users/?email=

