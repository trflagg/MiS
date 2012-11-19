
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http');

var app = express();

//shamelessly copied from https://github.com/dtryon/clog/blob/master/src/app.js
var environment = require('./environment');
var service = require('./service');
    service.init(environment);

require('./configuration')(app, express);
require('./controllers')(app, service, environment);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
