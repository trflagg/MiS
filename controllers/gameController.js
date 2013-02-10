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
	app.get('/game', 
			middleware.requireGame(service, true), 
			middleware.requireShip(service, true),
			game);
	function game(req, res) {
		//load pageUI
		var pageUI = shipHelper.getPageUIById(req.shipId, function(err, pageUI) {
			
			if (err) {
				return res.send(500, err);
			}
			
			//send ajax or html?
			//TODO: base this test off of something else? request-type?
			if (req.ajax)
			{
				console.log('ajax');
				sendHTMLAndJS('game/gameAjax', res, {
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
		});
	}
	exports.game = game;
	
	
	/**
	 * GET /controls/:control/:num
	 */
	app.get('/controls/:control/:num',
			middleware.requireGame(service), 
			middleware.requireShip(service),
			controls);
	function controls(req, res) {
		var controlName = req.params.control;
		var controlNum = req.params.num;
		
		//figure out what we need from db
		//start with ship variabls
		var dbProperties = 'location.vars quest.vars globals'
		
		// add command based on command name
		//TODO: Fix the HARDCODING! BAD PROGRAMMER!
		if (controlName == "weapons" ||
			controlName == "shields" ||
			controlName == "sensors" ||
			controlName == "databank" ||
			controlName == "processor") 
		{
			dbProperties = dbProperties + ' controls.'+controlName;
		}
		else if (controlName == "ship") {
			dbProperies = dbProperties + ' commands';
		}
		
		//request required data from db
		Ship.findById(req.shipId, dbProperties, function(err, ship) {
			if (err) {
				return res.send(500, "Database error: "+err);
			}
			if (ship == null) {
				return res.send(500, "Null ship from db");
			}
			var updateObject = {}
			updateObject.add = {}
			updateObject.remove = {}
		});
			
				
			
		
		return res.send(req.params.control + " is not available.");
		
	}
	

	
	return exports;
}