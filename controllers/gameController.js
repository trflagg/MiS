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
	 * GET /command/ship/:commandNum
	 */
	app.get('/command/ship/:commandNum',
			middleware.requireGame(service), 
			middleware.requireShip(service),
			handleShipCommand);
	function handleShipCommand(req, res) {
		var commandNum = req.params.commandNum
		
		// get message and ship data
		Ship.findById(req.shipId)
			.select('_id commands')
			.exec(function(err, foundShip) {
				console.log(foundShip.commands[commandNum].text);
				var message = foundShip.commands[commandNum].text
				return res.send(message);
		});
		
	}
	
	/**
	 * GET /command/crew/:controlName/:commandNum
	 */
	app.get('/command/crew/:crewMember/:commandNum',
			middleware.requireGame(service), 
			middleware.requireShip(service),
			handleCrewCommands);
	function handleCrewCommands(req, res) {
		var crewMember = req.params.crewMember;
		var commandNum = req.params.commandNum;
		
		var selectFields = '_id crew.'+crewMember+'.commands';
		
		// get message and ship data
		Ship.findById(req.shipId)
			.select(selectFields)
			.exec(function(err, foundShip) {
				console.log(foundShip.crew[crewMember].commands[commandNum].text);
				var message = foundShip.crew[crewMember].commands[commandNum].text
				return res.send(message);
		});
		
	}
	
	/**
	 * GET /command/control/:controlName/:commandNum
	 */
	app.get('/command/control/:controlName/:commandNum',
			middleware.requireGame(service), 
			middleware.requireShip(service),
			handleControlCommands);
	function handleControlCommands(req, res) {
		var controlName = req.params.controlName;
		var commandNum = req.params.commandNum;
		
		var selectFields = '_id controls.'+controlName+'.commands';
		
		// get message and ship data
		Ship.findById(req.shipId)
			.select(selectFields)
			.exec(function(err, foundShip) {
				console.log(foundShip.controls[controlName].commands[commandNum].text);
				var message = foundShip.controls[controlName].commands[commandNum].text
				return res.send(message);
		});
		
	}

	
	return exports;
}