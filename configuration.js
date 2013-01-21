//shamelessly copied from https://github.com/dtryon/clog/blob/master/src/configuration.js

module.exports = function(app, express, environment) {
	var path = require('path');
	var MongoStore = require('connect-mongo')(express),
	swig = require('./config/consolidate-swig').swig;
	
	//this from https://gist.github.com/3305458
	if ('development' == app.get('env')) {
		require('swig').init({ 
    		root: __dirname + '/views',
			cache: false, 
			allowErrors: true, 
			filters: {} 
		})
		console.log('configuring DEV')
	}
 
	if ('production' == app.get('env')) {
  		require('swig').init({ 
    		root: __dirname + '/views',
			cache: true, 
			allowErrors: false, 
			filters: {} 
		})
		console.log('configuring PROD')
	}

	app.configure(function(){
		app.set('port', process.env.PORT || 3000);
		
		app.engine('html', swig);
		app.set('view engine', 'html');
		app.set('views', __dirname + '/views');
		app.set('view options', { layout: false });
		
		app.use(express.static(path.join(__dirname, 'public')));
		
		app.use(express.cookieParser());
		
		app.use(express.session({
	    	secret: 'fa-la-la-blah',
    		store: new MongoStore({
      			url: environment.db.URL
    		})
 		}));
		
		app.use(errorHandler);
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
		
	});
	
	//this makes jade errors prettier:
	app.set('view options', { pretty: true });
	
	app.configure('development', function(){
		app.use(express.errorHandler());
	});
	
	function errorHandler(err, req, res, next) {
  		res.send(500, "Something broke");
	}
}
