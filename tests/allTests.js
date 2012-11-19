var allTests = function() {
	var utilTest = require('./utilTest');
	var gameTest = require('./gameTest');
	var expressTest = require('./expressTest');
	var messageTest = require('./messageTest');
	
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
				});
			});
		});
	});
}();