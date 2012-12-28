 var assert = require('assert'),
	mongoose = require('mongoose');
	request = require('request'); //https://github.com/mikeal/request

module.exports.runTest = function(callback) {

	console.log("BEGIN ShipTest");
	var endTest = function() {
		console.log("END ShipTest");
		callback();
	};
	mongoose.connection.collections['ships'].drop();
	
	//create a new game
	var opts = {
		uri : 'http://localhost:3000/start/',
		method : 'GET',
	}
	request(opts, function(error, clientResponse, body) {
		if(error) 
		{
			console.log('problem GETing new game: ' + error.message);
			endTest();
		}
		assert.equal(clientResponse.statusCode, 200, "new game status code != 200. Error = " + clientResponse.statusCode + " "+ body);
		console.log("game created");
		
		//submit captain's name
		var opts = {
			uri : 'http://localhost:3000/start/nameEntry',
			method : 'POST',
			form : {
				'name' : "Taylor"
			},
		}
		request(opts, function(error, clientResponse, body) {
			if(error) 
			{
				console.log('problem POSTing name entry: ' + error.message);
				endTest();
			}
			assert.equal(clientResponse.statusCode, 200, "name entry status code != 200. Error = " + clientResponse.statusCode + " "+ body);
			console.log("name entered");
			
			//submit ship data
			var opts = {
				uri : 'http://localhost:3000/start/newShip',
				method : 'POST',
				form : {
					shipName : "Yamato",
					security : "Yar",
					medical : "Crusher",
					info : "Data",
					empat : "Troi",
					engineering : "LeForge",
					cultural : "Picard",
				}
			}
			
			request(opts, function(error, clientResponse, body) {
				if(error) 
				{
					console.log('problem POSTing ship data: ' + error.message);
					endTest();
				}
				
				assert.equal(clientResponse.statusCode, 302, "ship data status code != 302. Error = " + clientResponse.statusCode + " "+ body);
				console.log("ship created");
				console.log("ship PageUI:");
				endTest();
			});
		});
	});
	
	
}