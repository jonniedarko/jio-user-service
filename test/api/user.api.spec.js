'use strict';
var chai = require('chai');
chai.config.includeStack = true;

var expect = chai.expect;
var mongoose = require('mongoose');
var app = require('../../index.js');

var request = require('supertest-as-promised').agent(app.listen());

describe('blog api test', function () {

	before(function (done) {
		// clean up db
		if (process.env.NODE_ENV === 'testing') {
			mongoose.connect(process.env.MONGO, function () {
				mongoose.connection.on('open', function () {
					mongoose.connection.db.dropDatabase(function () {
						done()

					})
				})
			});
		} else {
			done();
		}
	});

	var firstUser = {name: 'Bruce Wayne', email: 'Batman@gotham.com', password: 'darkKnight1!'};

	it('Create a User', function (done) {
		request
			.post('/api/users/signup')
			.send(firstUser)
			.expect(201)
			.then(function (res) {
				expect(res.body).to.not.be.empty;

				expect(res.body.user).to.exist;
				firstUser.id = res.body.user;
				expect(res.body.token).to.exist;
				firstUser.token = res.body.token;
				done();

			})
			.catch(done);
	});

	it('Login a user', function (done) {
		request
			.post('/api/users/Login')
			.send({email:firstUser.email, password:firstUser.password})
			.expect(200)
			.then(function (res) {
				expect(res.body.user).to.exist;
				firstUser.id = res.body.user;
				expect(res.body.token).to.exist;
				firstUser.token = res.body.token;
				done();

			})
			.catch(done)
	});

	//var postId;
	it('Get a user by id', function (done) {
		request
			.get('/api/users/' +  firstUser.id)
			.expect(200)
			.then(function (res) {
				expect(res.body).to.not.be.empty;
				expect(res.body._id).to.not.be.empty;
				expect(res.body._id).to.equal(firstUser.id);
				expect(res.body.name).to.eq(firstUser.name);
				expect(res.body.email).to.eq(firstUser.email);
				expect(res.body.password).to.not.exist;
				done();

			})
			.catch(done)
	});

	it('Get a user by email', function (done) {
		request
			.get('/api/users/')
			.query({email:firstUser.email})
			.expect(200)
			.then(function (res) {
				expect(res.body).to.not.be.empty;
				expect(res.body._id).to.not.be.empty;
				expect(res.body._id).to.equal(firstUser.id);
				expect(res.body.name).to.eq(firstUser.name);
				expect(res.body.email).to.eq(firstUser.email);
				expect(res.body.password).to.not.exist;
				done();

			})
			.catch(done)
	});

});