
/**
 * requireParams(params)
 * middleware that takes in array of strings and throws error if 
 * not all are present in the req.body
 */
function requireParams(params) {
	return function(req, res, next) {
		for (i in params)
		{
			if (!(params[i] in req.body))
			{
				console.log("Request missing parameter: "+params[i])
				res.send("Request missing parameter: "+params[i]);
			}
		}
		
		next();
	}
}
module.exports.requireParams = requireParams;


/**
 * requireGame()
 * redirects to /start if valid game _id is not found in session.
 */
function requireGame(service) 
{
	var Game = service.useModel('game').Game;
	return function(req, res, next) {
		if (req.session.game)
		{
			//find game
			Game.findById(req.session.game, function(err, game) {
				if (err || (game == null))
				{
					res.send("Error finding game: "+ err);
				}
				else
				{
					req.game = game;
					next();
				}
			});
		}
		else
		{
			res.redirect('/start');
		}
	}
}
module.exports.requireGame = requireGame;