var express = require('express');
var session = require('express-session');
var passport = require('passport');
var RedisStore = require('connect-redis')(session);

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

module.exports = app = express();
var mongoUrl = process.env.MONGO || 'mongodb://localhost:27017/userService'
mongoose.connect(mongoUrl);

var userRoutes = require('./api/user');
var authRoutes = require('./api/auth');
var passportStrategy = require('./api/auth/auth.strategy');
passportStrategy(passport);

app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'blahblahblah', store: new RedisStore({host:'localhost', port:6379})  })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./services');
app.use('/api/users/', userRoutes(passport));
app.use('/api/authorise', authRoutes);



var host;
var port = process.env.PORT || 3300;
var node_env = process.env.NODE_ENV || 'DEV';

app.listen(port, function () {
	host = this.address().address;

	console.log('app listening  at http://%s:%s in %s', host, port, node_env);

});
