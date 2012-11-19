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
	
	var postOpsNoData = {
		uri : 'http://localhost:3000/test',
		method : 'POST',
		json : { wrongthing : 'hello world'},
	}
	
	//test GET first
	request(opts, function(error, clientResponse, body) {
		if(error) 
		{
  			console.log('problem with GET request: ' + error.message);
			endTest();
		}
			
		assert.equal(clientResponse.statusCode, 200, "Test GET status code != 200.  Test status code = " + clientResponse.statusCode);
		eval("var body = "+body);
		assert(body.test, "body.test did not come back true. body.test = "+body.test);
		assert.equal(body.method, "GET", "body.method did not come back GET. body.method = "+body.method);
		console.log("GET successful.");
		
		//test POST
		request(postOps, function(error, clientResponse, body) {
			if(error) 
			{
  				console.log('problem with POST request: ' + error.message);
				endTest();
			}
			assert.equal(clientResponse.statusCode, 200, "Test POST status code != 200.  Test status code = " + clientResponse.statusCode);
			assert.notEqual(body, undefined, "POST body reply is undefined.");
			assert(body.test, "body.test did not come back true. body.test = "+body.test);
			assert.equal(body.method, "POST", "body.method did not come back POST. body.method = "+body.method);
			assert.equal(body.data, "hello world", "POST body data is incorrect. body.data="+body.data);
			
			//test POST with error reply
			request(postOpsNoData, function(error, clientResponse, body) {
				if(error) 
				{
  					console.log('problem with POST request: ' + error.message);
					endTest();
				}
				assert.equal(clientResponse.statusCode, 400, "Test POST w/o data status code != 400.  Test status code = " + clientResponse.statusCode);
				assert.equal(body, "POST object must contain item named 'data'", "Test POST w/o data body is not error message. body = " + body);
				console.log("POST successful.");
				endTest();
			});
		});
	});	
}
	
	
	