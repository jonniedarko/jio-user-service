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
			.post('/api/users/')
			.send(firstUser)
			.expect(201)
			.then(function (res) {
				expect(res.body).to.not.be.empty;
				expect(res.body._id).to.exist;
				firstUser.id = res.body._id;
				expect(res.body.name).to.eq(firstUser.name);
				expect(res.body.email).to.eq(firstUser.email);
				expect(res.body.password).to.not.exist;
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
				expect(res.body).to.not.be.empty;
				expect(res.body.name).to.eq(firstUser.name);
				expect(res.body.email).to.eq(firstUser.email);
				expect(res.body.password).to.not.exist;
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

	it('TEST MQTT', function (done) {

	});


/*	it('Get a list of Posts', function (done) {
		request
			.get('/api/blog')
			.expect(200)
			.then(function (res) {
				expect(res.body).to.not.be.empty;
				expect(res.body[0]._id).to.not.be.empty;
				postId = res.body[0]._id;
				expect(res.body[0].title).to.eq(helloWorldPost.title);
				expect(res.body[0].author).to.eq(helloWorldPost.author);
				expect(res.body[0].content).to.eq(helloWorldPost.content);
				done();

			})
			.catch(done)
	});
	var updatePost = {title: 'hello world', updated_by: 'John Smith', content: 'This is an Updated test Blog post'};
	it('update Post', function (done) {
		expect(postId).to.not.be.empty;
		request
			.put('/api/blog')
			.send({id: postId, post: updatePost})
			.expect(204)
			.then(function () {

				return request
					.get('/api/blog')
					.expect(200)
			})
			.then(function (res) {
				expect(res.body).to.not.be.empty;
				expect(res.body[0].title).to.eq(helloWorldPost.title);
				expect(res.body[0].author).to.eq(helloWorldPost.author);
				expect(res.body[0].author).to.eq(updatePost.updated_by);
				expect(res.body[0].content).to.eq(updatePost.content);
				done();
			})
			.catch(done);
	});

	it('Delete Post', function (done) {
		expect(postId).to.not.be.empty;
		request
			.delete('/api/blog/'+postId)
			.expect(204)
			.then(function () {

				return request
					.get('/api/blog')
					.expect(200)
			})
			.then(function (res) {
				expect(res.body).to.be.empty;
				expect(res.body.length).to.eq(0);
				done();
			})
			.catch(done);
	})*/

});