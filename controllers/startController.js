module.exports = function (app, service) {
	var jade = require('jade');
	var fs = require('fs');
	var middleware = require('./middleware');
	var Game = service.useModel('game').Game;
	var Ship = service.useModel('game').Ship;
	var CrewMember = service.useModel('game').CrewMember;
	var ShipControl = service.useModel('game').ShipControl;
	
	/**
	 * GET /start/
	 */
	app.get('/start/', start);
	function start(req, res) {
		
		//check for cookie
		//res.clearCookie('game');
		if (req.cookies.game)
		{
			req.session.game = req.cookies.game;
			nextURL = "/start/selectShip";
		}
		else
		{
			//set cookie:
			//res.cookie('game', 1);
			//delete cookie:
			//res.clearCookie('game')
			nextURL = "/start/nameEntry";
		}
		res.render('./start/startIndex', { 'nextURL' : nextURL});
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
			console.log(game);
			err = err || "";
			res.send("Cookie deleted.  Err:"+err);
		});
	}
		
	/**
	 * GET /start/nameEntry
	 */
	app.get('/start/nameEntry', nameEntry);
	function nameEntry(req, res) 
	{
		sendJadeAndJS('./views/start/nameEntry',res);
	};
	
	/**
	 * POST /start/nameEntry
	 */
	app.post('/start/nameEntry', 
		middleware.requireParams(["name"]), 
		nameEntryPOST);
	function nameEntryPOST(req, res) {
		//check for name
		if (req.body)
		{
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
							sendJadeAndJS('./views/start/nameEntry', res, {err: err});
						}
						else
						{
							//success!
							//store id in cookie and session
							res.cookie('game', newGame._id);
							req.session.game = newGame._id;
							req.game = newGame;
							//forward to selectShip
							selectShip(req, res);
						}
				});
							
			}
			else
			{
				sendJadeAndJS('./views/start/nameEntry', res,  {err: "Name must be at least 3 characters."});
			}
		}
		else
		{
			sendJadeAndJS('./views/start/nameEntry', res,  {err: "Name not sent."});
		}
	}
	
		
	/**
	 * GET /start/startInterface
	 */
	app.get('/start/startInterface', 
		middleware.requireGame(service), 
		startInterface)
	function startInterface(req, res) {
		console.log(req.game);
		sendJadeAndJS('./views/start/startInterface', res, {defaultURL: "/start/selectShip", name: req.game.name});
	}
	
	
	/**
	 * GET /start/selectShip
	 */
	app.get('/start/selectShip', 
		middleware.requireGame(service), 
		selectShip)
	function selectShip(req, res) {
		console.log(req.game);
		//do we have any ships?
		if (req.game.ships.length > 0)
		{
			sendJadeAndJS('./views/start/selectShip', res, {
				ships: req.game.ships, 
				name: req.game.name
			});
		}
		else
		{
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
		//start the game!
		res.redirect('/game');
	}
	
	/**
	 * GET /start/newShip
	 */
	app.get('/start/newShip', 
		middleware.requireGame(service),
		newShip)
	function newShip(req, res) {
		console.log(req.game);
		sendJadeAndJS('./views/start/newShip', res, {
			ships: req.game.ships, 
			name: req.game.name
		});
	}
	
	/**
	 * POST /start/newShip
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
		//need some validation?
		console.log(req.body);
		Ship.create({
			name : req.body.shipName,
			security : new CrewMember({ name : req.body.security }),
			medical : new CrewMember({ name : req.body.medical }),
			info : new CrewMember({ name : req.body.info }),
			empat : new CrewMember({ name : req.body.empat }),
			engineering : new CrewMember({ name : req.body.engineering }),
			cultural : new CrewMember({ name : req.body.cultural }),
			weapons : new ShipControl(),
			shields : new ShipControl(),
			sensors : new ShipControl(),
			databank : new ShipControl(),
			processors : new ShipControl()
		}, function(err, newShip) {
			if (err)
			{
				//need better error handling here
				res.send(err);
			}
			else
			{
				//start the game!
				req.session.ship = newShip._id;
				req.game.ships.push(newShip);
				//add error handling!
				req.game.save();
				res.redirect('/game');
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