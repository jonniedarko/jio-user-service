var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

module.exports = app = express();

var mongoUrl = process.env.MONGO || 'mongodb://localhost:27017/userService';
mongoose.connect(mongoUrl);

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


var userRoutes = require('./api/user');
var authRoutes = require('./api/auth');
var passportStrategy = require('./api/auth/auth.strategy');
passportStrategy(passport);

app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

app.use('/api/users/', userRoutes(passport));
app.use('/api/authorise', authRoutes);



var host;
var port = process.env.PORT || 3300;
var node_env = process.env.NODE_ENV || 'DEV';

app.listen(port, function () {
	host = this.address().address;

	console.log('app listening  at http://%s:%s in %s', host, port, node_env);

});
