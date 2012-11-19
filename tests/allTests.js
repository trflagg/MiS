var allTests = function() {
	var utilTest = require('./utilTest');
	var gameTest = require('./gameTest');
	var expressTest = require('./expressTest');
	var messageTest = require('./messageTest');
	
	var mongoose = require('mongoose');
	mongoose.connect('localhost','test');
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	
	console.log("");
	console.log("_____________ Running All Tests ____________");
	
	utilTest.runTest(function() {
		console.log("");
		gameTest.runTest(function() {
			console.log("");
			expressTest.runTest(function() {
				console.log("");
				messageTest.runTest(function() {
					console.log("________ Tests Ended ______________");
					console.log("");
					mongoose.disconnect();
				});
			});
		});
	});
}();