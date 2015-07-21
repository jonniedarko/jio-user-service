
var gulp = require('gulp');
var env = require('gulp-env');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');

gulp.task('serve', [], function () {

	nodemon({
		script: "./index.js",
		env: {
			NODE_ENV: 'development',
			JWT_SECRET: 'some super super jwt secret',
			PORT: '3300',
			MONGO: 'mongodb://localhost:27017/userService'
		}
	});
});

gulp.task('test', function (done) {
	env({
		vars: {
			NODE_ENV: 'testing',
			JWT_SECRET: 'some super super jwt secret',
			PORT: 3301,
			MONGO: 'mongodb://localhost:27017/userService-test'
		}
	});

	var gulpStream = gulp
		.src('test/**/*.spec.js')
		.pipe(mocha({
			bail: false,
			reporter: 'spec'
		}));

	gulpStream.on('error', function (err) {
		done(err);
		process.exit();
	});

	gulpStream.on('end', function () {
		done();
		process.exit();
	});


});