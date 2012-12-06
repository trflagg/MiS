//shamelessly copied from https://github.com/dtryon/clog/blob/master/src/configuration.js

module.exports = function(app, express, environment) {
	var path = require('path');
	var MongoStore = require('connect-mongo')(express);
	
	app.configure(function(){
		app.set('port', process.env.PORT || 3000);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.cookieParser());
		app.use(express.session({
	    	secret: 'fa-la-la-blah',
    		store: new MongoStore({
      			url: environment.db.URL
    		})
 		}));
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
