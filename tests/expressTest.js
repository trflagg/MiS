module.exports.runTest = function(callback) {
 	var assert = require('assert'),
		request = require('request'); //https://github.com/mikeal/request
	
	console.log("BEGIN ExpressTest");
	var endTest = function() {
		console.log("END ExpressTest");
		callback();
	};
	
	var opts = {
		uri : 'http://localhost:3000/test',
		method : 'GET',
	}
	
	var postOps = {
		uri : 'http://localhost:3000/test',
		method : 'POST',
		json : { data : 'hello world'},
	}
	
	//test GET first
	request(opts, function(error, clientResponse, body) {
		if(error) 
		{
  			console.log('problem with GET request: ' + error.message);
			endTest();
		}
			
		assert.equal(clientResponse.statusCode, 200, "Test GET status code != 200.  Test status code = " + clientResponse.statusCode);
		console.log('GET body: ' + body);
		
		//test POST
		request(postOps, function(error, clientResponse, body) {
			if(error) 
			{
  				console.log('problem with POST request: ' + error.message);
				endTest();
			}
			assert.equal(clientResponse.statusCode, 200, "Test POST status code != 200.  Test status code = " + clientResponse.statusCode);
			assert.notEqual(body, undefined, "POST body reply is undefined.");
			assert.equal(body.data, "hello world", "POST body data is incorrect. body.data="+body.data);
			console.log('POST body: ' + body);
			endTest();
		});
	});	
}
	
	
	