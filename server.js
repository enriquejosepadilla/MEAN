/**
 * Created by mtbsickrider on 11/18/15.
 */
var express = require('express');
var	stylus = require('stylus');
var bodyParser = require('body-parser');
var morgan = require('morgan');



var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str,path) {
	return stylus(str).set('filename' , path);
}

app.set('views', __dirname + '/server/views');
app.set('view engine',  'jade');
app.use(stylus.middleware(
	{
	src: __dirname + '/public',
	compile: compile
	}
));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(morgan('combined'));



app.get('/', function (req,res) {
    res.render('index');
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});