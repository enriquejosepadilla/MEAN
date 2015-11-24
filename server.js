/**
 * Created by mtbsickrider on 11/18/15.
 */
var express = require('express');
var	stylus = require('stylus');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');


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

if (env === "development") {
	mongoose.connect('mongodb://localhost/mean');
} else {
	mongoose.connect('mongodb://enrique:mean@ds057224.mongolab.com:57224/mean');
}

var db = mongoose.connection;
db.on('error' , console.error.bind(console, ' connection error'));
db.once('open', function callback() {
	console.log('mean db opened');
});

var messageSchema = mongoose.Schema({message: String});
var MessageModel = mongoose.model('Message' , messageSchema);

var mongoMessage;
MessageModel.findOne().exec(function(err , messageDoc) {
	if (messageDoc)
		mongoMessage = messageDoc.message;
	else {
		mongoMessage = "Didnt find a message";
	}
});

app.get('/partials/:partialPath' , function(req,res){
	console.log('looking for partials:' + req.params);
	res.render('partials/' + req.params.partialPath);
});



app.get('*', function (req,res) {
		console.log('index loaded');
    res.render('index', {
			mongoMessage: mongoMessage
		});
});

var portNum = process.env.PORT || 3000;
var server = app.listen(portNum, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});