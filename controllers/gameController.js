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
	app.get('/game', 
			middleware.requireGame(service), 
			middleware.requireShip(service),
			game);
	function game(req, res) {
		console.log(req.game);
		//grab ship info
		Ship.findById(req.shipId, function(err, ship) {
			if (err || (ship == null))
			{
				res.send("Error finding ship: "+ err);
			}
			else
			{
				//load pageUI
				var pageUI = shipHelper.getPageUI(ship);
				console.log(pageUI);
				sendJadeAndJS('./views/game/gameIndex', res, {'pageUI' : pageUI});
			}
		});
	}
		
	
	
	/**
	 * sendJadeAndJS()
	 */
	function sendJadeAndJS(viewPath, res, locals) {
		locals = locals || {};
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
				res.send({
					html: html,
					js: js
				});
			});
		});
	}
}