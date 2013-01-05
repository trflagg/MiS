module.exports = function (app, service) {
	var jade = require('jade');
	var fs = require('fs');
	var middleware = require('./middleware');
	var shipHelper = require('../helpers/shipHelper')(service);
	var Game = service.useModel('game').Game;
	var Ship = service.useModel('game').Ship;
	
	/**
	 * GET /game
	 */
	exports.game = function(req, res) {
		console.log(req.shipId);
		//grab ship info
		Ship.findById(req.shipId, function(err, ship) {
			console.log(req.shipId);
			if (err || (ship == null))
			{
				res.send(500, "Error finding ship: "+ err);
			}
			else
			{
				//load pageUI
				var pageUI = shipHelper.getPageUI(ship);
				console.log(pageUI);
				
				//send ajax or html?
				//TODO: base this test off of something else? request-type?
				if (req.ajax)
				{
					console.log('ajax');
					sendJadeAndJS('./views/game/gameAjax', res, {'pageUI' : pageUI});
				}
				else
					res.render('./game/gameIndex', {pageUI : JSON.stringify(pageUI)});		
			}
		});
	}
	app.get('/game', 
			middleware.requireGame(service), 
			middleware.requireShip(service),
			exports.game);
		
	
	
	/**
	 * sendJadeAndJS()
	 */
	function sendJadeAndJS(viewPath, res, pageLocals) {
		pageLocals = pageLocals || {};
		locals = pageLocals.locals || {};
		console.log("rendering viewPath: "+viewPath)
		//read the jade and js files
		fs.readFile(viewPath+'.jade', 'utf8', function (err,jadeHTML) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			fs.readFile(viewPath+'.js', 'utf8', function (err,js) {
				if (err) {
					console.log(err);
					res.send(err);
				}	
				var opts = { 
					pretty: true,
					filename: viewPath+'.jade',
				}
				var fn = jade.compile(jadeHTML, opts);
				var html = fn(locals);
				//send html and javascript
				var responseObject = {
					html: html,
					js: js
				};
				console.log(pageLocals);
				console.log(pageLocals.pageUI);
				if (pageLocals.pageUI) responseObject.pageUI = pageLocals.pageUI;
				
				res.send(responseObject);
			});
		});
	}
	
	return exports;
}