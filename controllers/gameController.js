module.exports = function (app, service) {
	var fs = require('fs');
	var middleware = require('./middleware');
	var shipHelper = require('../helpers/shipHelper')(service);
	var Game = service.useModel('Game');
	var Ship = service.useModel('Ship');
	
	var sendHTMLAndJS = require('../utils').sendHTMLAndJS;
	
	/**
	 * GET /game
	 */
	exports.game = function(req, res) {
		//grab ship info
		Ship.findById(req.shipId, function(err, ship) {
			if (err || (ship == null))
			{
				res.send(500, "Error finding ship: "+ err);
			}
			else
			{
				//load pageUI
				var pageUI = shipHelper.getPageUI(ship);
				console.log(pageUI);
				console.log(req.game);
				console.log(req.game.handed);
				
				//send ajax or html?
				//TODO: base this test off of something else? request-type?
				if (req.ajax)
				{
					console.log('ajax');
					sendHTMLAndJS('./views/game/gameAjax', res, {
						pageUI : pageUI, 
						locals : {
							handed : req.game.handed,
						},
					});
				}
				else
				{
					res.render('./game/gameIndex', {
						pageUI : JSON.stringify(pageUI), 
						handed : req.game.handed,
					});	
				}
			}
		});
	}
	app.get('/game', 
			middleware.requireGame(service), 
			middleware.requireShip(service),
			exports.game);
	
	
	/**
	 * GET /controls/:control/:num
	 */
	app.get('/controls/:control/:num',
			middleware.requireGame(service), 
			middleware.requireShip(service),
			controls);
	function controls(req, res) {
		var control = req.params.control;
		var num = req.params.num;
		if (control === {} && num === {})
		{
			return res.send(400, "Must include control & num.");
		}
		if (!req.ship.controls.hasOwnProperty(control))
		{
			return res.send(400, "Control not found: " + control);
		}
		var shipControl = req.ship.controls[control];
		var command = shipControl[num];
		if (command === undefined)
		{
			//default, 
			//either wrong num was sent
			//or control has now commands
			return res.send("That doesn't apply");
		}
		
		//perform command on shipControl
		res.send("Hello world");
		
	}
	

	
	return exports;
}