module.exports = function (app, service) {
	var jade = require('jade');
	var fs = require('fs');
	/**
	 * GET /start/
	 */
	app.get('/start/', function(req, res) {
		
		//check for cookie
		res.clearCookie('game');
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
			nextURL = "/start/newGame";
		}
		res.render('./start/startLayout', { 'nextURL' : nextURL});
	});
		
	/**
	 * GET /start/newGame
	 */
	app.get('/start/newGame', function(req, res) {
		//read the jade and js files
		fs.readFile('./views/start/newGame.jade', 'utf8', function (err,jadeResult) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			fs.readFile('./views/start/newGame.js', 'utf8', function (err,js) {
				if (err) {
					console.log(err);
					res.send(err);
				}	
				var fn = jade.compile(jadeResult);
				var html = fn();
				//send html and javascript
				res.send({
					html: html,
					js: js
				});
			});
		});
	});

}