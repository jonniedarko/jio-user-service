var express = require('express');

var bodyParser = require('body-parser');

module.exports = app = express();

app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app = require('./index').init(app);

var host;
var port = process.env.PORT || 3300;
var node_env = process.env.NODE_ENV || 'DEV';

app.listen(port, function () {
	host = this.address().address;

	console.log('app listening  at http://%s:%s in %s', host, port, node_env);

});
