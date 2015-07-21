var express = require('express');
//var session = require('express-session');
//var cookieParser = require('cookie-parser')
var passport = require('passport');
//var RedisStore = require('connect-redis')(session);
// use mongo for dev


var bodyParser = require('body-parser');
var mongoose = require('mongoose');

module.exports = app = express();
var mongoUrl = process.env.MONGO || 'mongodb://localhost:27017/userService';
mongoose.connect(mongoUrl);

//var MongoStore = require('connect-mongo')(session);

app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, Content-Type, Accept, X-Key, Authorization' );
		//'X-Requested-With, content-type, Authorization');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	//res.setHeader('Access-Control-Allow-Credentials', true);

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

//app.use(cookieParser());
//app.use(session({ secret: 'blahblahblah', store: new RedisStore({host:'localhost', port:6379})  })); //session secret
/*app.use(session({
	secret:'secret',
	cookie: {
		//maxAge: 365*24*60*60*1000, // year
		//secure: true,
		httpOnly: false
	},
	//maxAge: new Date(Date.now() + 365*24*60*60*1000),
	store: new MongoStore({ mongooseConnection: mongoose.connection }, function(err){
		console.log(err || 'connect-mongodb setup ok');
	})
}));*/

app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions



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
