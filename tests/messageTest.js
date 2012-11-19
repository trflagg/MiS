
 var assert = require('assert'),
	mongoose = require('mongoose'),
	request = require('request'); //https://github.com/mikeal/request
	
module.exports.runTest = function(callback) {
	
	console.log("BEGIN MessageTest");
	var endTest = function() {
		console.log("END MessageTest");
		callback();
	};
	
	//connect to mongoose
    var checkConnectionExists = (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2);
    if(!checkConnectionExists)
	{
		mongoose.connect('localhost','test');
		mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	}
	
	//load models
	var directMessage = require('../models/directMessage')(mongoose);
	
	
	//drop message table
	mongoose.connection.collections['directmessages'].drop();
	
	//make new direct message
	var newMessage = new directMessage.DirectMessage({
		subject	: "Upon arrival at Struven",
		from	: "Arthurian Delegation",
		date	: "35811411",
		text	: "Captain,78 hours ago, a 22 year-old Kruger female was reported dead in her dorm room by her roommate, a 22 year-old Arthurian female."})
	.on('error', function() {
		console.error.bind(console, 'directMessage error:');
		endTest();
	});
	
	newMessage.save(function(err) {
		if (err) { console.log("Error saving manual new DirectMessage: "+ err)  };
	});
	
	assert.notEqual(newMessage.id, undefined, "newMessage.id() is undefined.");
	console.log("newMessage.id: "+newMessage.id);
	
	//test via REST api
	var opts = {
		uri : 'http://localhost:3000/game/directmessage/'+newMessage.id,
		method : 'GET',
	}
	
	//GET
	request(opts, function(error, clientResponse, body) {
		if(error) 
		{
			console.log('problem with GET request: ' + error.message);
			endTest();
		}
		assert.equal(clientResponse.statusCode, 200, "GET status code != 200. Error = " + clientResponse.statusCode + " "+ body);
		assert.notEqual(body, undefined, "GET returned body = undefined.");
		eval("result = "+body);
		assert.equal(result.subject, "Upon arrival at Struven", "Subject returned from GET does not match original object.");
		
		//POST
		var POSTOpts = {
			uri : 'http://localhost:3000/game/directmessage/',
			method : 'POST',
			json : {
				directMessage : {
					subject : "Well done!",
					from 	: "Arthurian Delegation",
					date	: "35911411",
					text	: "You have performed beyond the call of duty! Congratulations!"
				},
			},
		}
		request(POSTOpts, function(error, clientResponse, body) {
			if(error)
			{
				console.log('problem with POST request: ' + error.message);
				endTest();
			}
			assert.equal(clientResponse.statusCode, 200, "POST status code != 200. Error = " + clientResponse.statusCode + " "+ body);
			assert.notEqual(body, undefined, "GET returned body = undefined.");
			console.log(body);
			
			//GET what you just POSTED
			var id = body.id
			opts.uri = 'http://localhost:3000/game/directmessage/'+id;
			request(opts, function(error, clientResponse, body) {
				if(error) 
				{
					console.log('problem with 2nd GET request: ' + error.message);
					endTest();
				}
				assert.equal(clientResponse.statusCode, 200, "2nd GET status code != 200. Error = " + clientResponse.statusCode + " "+ body);
				assert.notEqual(body, undefined, "2nd GET returned body = undefined.");
				eval("result = "+body);
				console.log(result.text);
				assert.equal(result.text, POSTOpts.json.directMessage.text, "Text returned from 2nd GET does not match what was sent.");
				
				//now DELETE
				var DELETEOpts = {
					uri : 'http://localhost:3000/game/directmessage/'+id,
					method : 'DELETE',
				}
				request(DELETEOpts, function(error, clientResponse) {
					if(error)
					{
						console.log('problem with DELETE request: ' + error.message);
						endTest();
					}
					assert.equal(clientResponse.statusCode, 200, "DELETE status code != 200. Error = " + clientResponse.statusCode + " "+ body);
					
					
					//a GET should now fail
					request(opts, function(error, clientResponse, body) {
						if(error) 
						{
							console.log('problem with 3rd GET request: ' + error.message);
							endTest();
						}
						assert.equal(clientResponse.statusCode, 404, "3rd GET status code != 404. Error = " + clientResponse.statusCode);
						
						//Clean up after ourselves by DELETEing the first message
						DELETEOpts.uri = 'http://localhost:3000/game/directmessage/'+newMessage.id,
						request(DELETEOpts, function(error, clientResponse) {
							if(error)
							{
								console.log('problem with DELETE request: ' + error.message);
								endTest();
							}
							assert.equal(clientResponse.statusCode, 200, "2nd DELETE status code != 200. Error = " + clientResponse.statusCode + " "+ body);
					
							endTest();	
						});
					});
				});
			});
		});
	});
}