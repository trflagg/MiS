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
			nextURL = "/start/shipSelect";
		}
		else
		{
			//set cookie:
			//res.cookie('game', 1);
			//delete cookie:
			//res.clearCookie('game')
			nextURL = "/start/nameEntry";
		}
		res.render('./start/startLayout', { 'nextURL' : nextURL});
	}
	
	/**
	 * GET /start/deleteCookie
	 */
	app.get('/start/deleteCookie', deleteCookie);
	function deleteCookie(req, res)
	{
		var game = req.cookies.game
		res.clearCookie('game');
		res.send("Cookie deleted");
		//delete game
	}
		
	/**
	 * GET /start/newGame
	 */
	app.get('/start/nameEntry', nameEntry);
	function nameEntry(req, res) 
	{
		sendJadeAndJS('./views/start/nameEntry',res);
	};
	
	/**
	 * POST /start/newGame
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
						console.log(err);
						console.log(newGame);
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
	 * GET /start/shipSelect
	 */
	app.get('/start/shipSelect', shipSelect)
	function shipSelect(req, res) {
		//check session
		if (req.session.game)
		{
			//find game
			Game.findById(req.session.game, function(err, game) {
				if (err)
				{
					start(req, res);
				}
				else
				{
					console.log(game);
					sendJadeAndJS('./views/start/shipSelect', res, {'name' : game.name});
				}
			});
					
		}
		else
		{
			start(req, res);
		}
	}
	
	/**
	 * sendJadeAndJS()
	 */
	function sendJadeAndJS(viewPath, res, locals) {
		locals = locals || {};
		
		//read the jade and js files
		fs.readFile(viewPath+'.jade', 'utf8', function (err,jadeResult) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			fs.readFile(viewPath+'.js', 'utf8', function (err,js) {
				if (err) {
					console.log(err);
					res.send(err);
				}	
				var fn = jade.compile(jadeResult);
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