module.exports.runTest = function(callback) {
	
	var assert = require('assert'),
		mongoose = require('mongoose');
	
	//start test
	console.log("BEGIN GameTest");
	
	//connect to mongoose
    var checkConnectionExists = (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2);
    if(!checkConnectionExists)
	{
		mongoose.connect('localhost','test');
		mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	}
	//load models
	var game = require('../models/game')(mongoose);
	
	//drop game table
	mongoose.connection.collections['games'].drop();
	
	//create new game
	var newGame = new game.Game({ name: "Taylor", dateStarted: new Date()});
	assert.equal(newGame.name, "Taylor", "Model in memory does not have correct captain.");
	
	//save
	newGame.save(function(err) {
  		if (err) 
		{
			console.log("Error during save: "+err);
		}
	
		console.log("Object saved.");
		
		//check db
		game.Game.findOne({ name: "Taylor" }).exec(function(err, foundGame) {
  			if (err) 
			{
				console.log("Error during findOne: "+err);
			}
			
			//check found game
			assert.notEqual(foundGame, undefined, "foundGame is not defined.");
			console.log("Object found.");
			assert.equal(foundGame.name, "Taylor", "Model from db does not have correct captain.");
			assert.equal(foundGame.dateStarted.getTime(), newGame.dateStarted.getTime(), "dateStarted of models does not match.");
			
			//clean up after ourselves
			foundGame.remove(function(err, foundGame) {
  				if (err) 
				{
					console.log("Error during remove: "+err);
				}
				console.log("Object removed.");
				
				//try to find it again
				game.Game.findOne({ name: "Taylor"}).exec(function(err, emptyGame) {
  					if (err) 
					{
						console.log("Error during assumed-empty findOne: "+err);
					}
					assert.equal(emptyGame, undefined, "findOne after removal returned defined object")
					
					//disconnect
					//mongoose.disconnect(endTest());
					endTest();
				});
			});
		});
	});
	
	var endTest = function() {
		console.log("END GameTest"); 
		callback();
	};
}