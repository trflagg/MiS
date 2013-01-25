module.exports = function (app, service) {
	var swig = require('swig');
	var fs = require('fs');
	
	var middleware = require('./middleware');
	var startGame = require('./gameController')(app, service).game;
	
	var Game = service.useModel('Game');
	var Ship = service.useModel('Ship');
	var CrewMember = service.useModel('CrewMember');
	var ShipControl = service.useModel('ShipControl');
	var Quest = service.useModel('Quest');
	
	var shipHelper = require('../helpers/shipHelper')(service);
	
	var sendHTMLAndJS = require('../utils').sendHTMLAndJS;
	
	/**
	 * GET /start/
	 */
	app.get('/start/', start);
	function start(req, res) {
		//check for cookie
		if (req.cookies.game)
		{
			req.session.game = req.cookies.game;
			nextURL = "/start/selectShip";
			//uncomment to turn cookie forwarding off
			//nextURL = "/start/nameEntry";
		}
		else
		{
			nextURL = "/start/nameEntry";
		}
		//res.render('./start/simple.html');
		res.render('./start/startIndex.html', { locals: { 'nextURL' : nextURL}});
	}
	
	/**
	 * GET /start/deleteCookie
	 */
	app.get('/start/deleteCookie', deleteCookie);
	function deleteCookie(req, res)
	{
		var game = req.cookies.game
		//delete game
		res.clearCookie('game');
		Game.findByIdAndRemove(game, function(err, game) {
			if (err) {
				res.send("Error deleting cookie: "+err);
			}
			else {
				res.send("Cookie deleted.");
			}
		});
	}
		
	/**
	 * GET /start/nameEntry
	 */
	app.get('/start/nameEntry', nameEntry);
	function nameEntry(req, res) 
	{
		sendHTMLAndJS('start/nameEntry',res);
	};
	
	/**
	 * POST /start/nameEntry
	 */
	app.post('/start/nameEntry', 
		middleware.requireParams(["name"]), 
		nameEntryPOST);
	function nameEntryPOST(req, res) {
		//get the name
		var name = req.body.name;
		//server-side validation
		if (name.length >= 3)
		{
			//create the game and set name
			var newGame = Game.create({
					name : name,
					dateStarted: new Date()
				}, function(err, newGame) {
					if (err)
					{
						sendHTMLAndJS('start/nameEntry', res, { locals: {err: err}});
					}
					else
					{
						//success!
						//store id in cookie and session
						res.cookie('game', newGame._id);
						req.session.game = newGame._id;
						req.game = newGame;
						//ask handiness
						sendHTMLAndJS('start/askHandiness', res, { locals: {name : name}});
					}
			});
						
		}
		else
		{
			sendHTMLAndJS('start/nameEntry', res,  { locals: {err: "Name must be at least 3 characters."}});
		}
	}
	
	/**
	 * POST /start/askHandiness
	 */
	app.post('/start/askHandiness',
		middleware.requireParams(["handiness"]), 
		middleware.requireGame(service),
		postHandiness)
	function postHandiness(req, res) {
		var handiness = req.body.handiness;
		if (handiness != "left"  && handiness != "right")
		{
			return res.send(400, "Illegal handiness sent.");
		}
		
		req.game.handed = handiness;
		req.game.save(function(err) {
			
			if (err) { return res.send(500); }
			
			//success!
			//move on with ship selection
			return selectShip(req, res)
		});
	}
	
	
	/**
	 * GET /start/selectShip
	 */
	app.get('/start/selectShip', 
		middleware.requireGame(service), 
		selectShip)
	function selectShip(req, res) {
		//do we have any ships?
		if (req.game.ships.length > 0)
		{
			//get ship names & ids
			ships = []
			Ship.find({'_id': {$in : req.game.ships}}).select('name _id location.name').exec(function(err, foundShips) {
				if (err)
				{
					res.send(500, "Error retrieving ships from db: "+err);
				}
				else
				{
					console.log(foundShips);
					for (var i in foundShips)
					{
						var foundShip = foundShips[i];
						console.log(foundShip);
						shipData = { name : foundShip.name, _id : foundShip._id, locationName : foundShip.location.name };
						ships.push(shipData);
					}
					sendHTMLAndJS('start/selectShip', res, { locals: {
						ships: ships, 
						name: req.game.name
					}});
				}
			});
		}
		else
		{
			//no ships to select - make a new one
			newShip(req, res);
		}
	}
	
	
	/**
	 * POST /start/selectShip
	 */
	app.post('/start/selectShip', 
		middleware.requireParams(["ship"]), 
		middleware.requireGame(service),
		selectShipPOST)
	function selectShipPOST(req, res) {
		//set session
		req.session.ship = req.body.ship;
		req.shipId = req.body.ship;
		req.ajax = req.body.ajax;
		//start the game!
		return startGame(req, res);
	}
	
	/**
	 * GET /start/newShip
	 */
	app.get('/start/newShip', 
		middleware.requireGame(service),
		newShip)
	function newShip(req, res) {
		sendHTMLAndJS('start/newShip', res, { locals: { name: req.game.name }});
	}
	
	/**
	 * POST /start/newShip
	 * TODO: Error Handling for creation errors
	 * TODO: Error handling for quest find/mongoose errors
	 */
	app.post('/start/newShip', 
		middleware.requireParams([
			"shipName",
			"security",
			"medical",
			"info",
			"empat",
			"engineering",
			"cultural"]), 
		middleware.requireGame(service),
		newShipPOST)
	function newShipPOST(req, res) {
		//create new ship
		//need some validation!!!
		console.log(req.body);
		shipHelper.newShip({
					shipName : req.body.shipName,
					security : req.body.security,
					medical : req.body.medical,
					info : req.body.info,
					empat : req.body.empat,
					engineering : req.body.engineering,
					cultural : req.body.cultural, 
		}, function(err, newShip) {
			if (err) {
				//need better error handling here?
				return res.send(500, err);
			}
			
			//start the game!
			req.session.ship = newShip._id;
			req.game.ships.push(newShip._id);
			
			req.game.save(function(err) {
				if (err) {
					//error handling 
					return res.send(500, err);
				}
				//start the game!
				req.shipId = newShip._id;
				req.ajax = req.body.ajax;
				return startGame(req, res);
			});
		});
	}
	


}