var express 	= require('express'),
	http 		= require('http'),
	Resource 	= require('express-resource'),
	Db			= require('argie/db');

var app = express();

//check argument
var testArg = false;
var devArg = false;
if (process.argv[2] && process.argv[2] == "-test")
{
	//connect to testdb
	testArg = true;
	console.log("testArg = true");
	var environment = require('./environment-test');
}
else if (process.argv[2] && process.argv[2] == "-prod")
{
	var environment = require('./environment-prod');
}
else
{
	devArg = true;
	console.log("devArg = true");
	var environment = require('./environment-dev');
}
var db = new Db(environment);

//define models
require('./models')(db);

//configure express
require('./configuration')(app, express, environment);

//load URI controllers
require('./controllers')(app, service, environment);


if (testArg)
{
	require('./controllers/testController')(app, service);
	require('./controllers/directMessageTestController')(app, service);
}

//start 'er up
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
