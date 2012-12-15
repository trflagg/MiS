module.exports = function (app, service) {
	var jade = require('jade');
	var fs = require('fs');
	var Game = service.useModel('game').Game;
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
			nextURL = "/start/startInterface";
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
	app.post('/start/nameEntry', nameEntryPOST);
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
							//forward to selectShip
							shipSelect(req, res);
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
	app.get('/start/startInterface', startInterface)
	function startInterface(req, res) {
		//check session
		if (req.session.game)
		{
			//find game
			Game.findById(req.session.game, function(err, game) {
				if (err || (game == null))
				{
					console.log("Error getting game: "+ err);
					start(req, res);
				}
				else
				{
					console.log(game);
					sendJadeAndJS('./views/start/startInterface', res, {defaultURL: "/start/selectShip", name:game.name});
				}
			});
					
		}
		else
		{
			console.log("No game found.");
			start(req, res);
		}
	}
	
	
	/**
	 * GET /start/selectShip
	 */
	app.get('/start/selectShip', selectShip)
	function selectShip(req, res) {
		//check session
		if (req.session.game)
		{
			//find game
			Game.findById(req.session.game, function(err, game) {
				if (err || (game == null))
				{
					console.log("Error getting game: "+ err);
					start(req, res);
				}
				else
				{
					console.log(game);
					res.render('./start/selectShip', {
						ships: game.ships,
						name : game.name
					});
				}
			});
					
		}
		else
		{
			console.log("No game found.");
			start(req, res);
		}
	}
	
	/**
	 * GET /start/newShip
	 */
	app.get('/start/newShip', newShip)
	function newShip(req, res) {
		//check session
		if (req.session.game)
		{
			//find game
			Game.findById(req.session.game, function(err, game) {
				if (err || (game == null))
				{
					console.log("Error getting game: "+ err);
					start(req, res);
				}
				else
				{
					console.log(game);
					res.render('./start/shipForm', {ships: game.ships});
				}
			});
					
		}
		else
		{
			console.log("No game found.");
			start(req, res);
		}
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