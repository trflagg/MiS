//shamelessly copied from https://github.com/dtryon/clog/blob/master/src/configuration.js

module.exports = function(app, express) {
	var path = require('path');
	
	app.configure(function(){
		app.set('port', process.env.PORT || 3000);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(express.static(path.join(__dirname, 'public')));
		
	});
		//this makes jade errors prettier:
		app.set('view options', { pretty: true });
	
	app.configure('development', function(){
		app.use(express.errorHandler());
	});
}
