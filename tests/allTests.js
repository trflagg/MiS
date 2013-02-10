var allTests = function() {
	var async = require('async');
	
	var utilTest = require('./utilTest');
	var gameTest = require('./gameTest');
	var expressTest = require('./expressTest');
	var messageTest = require('./messageTest');
	var startTest = require('./startTest');
	
	var mongoose = require('mongoose');
	mongoose.connect('localhost','testdb');
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	
	//setup db
	var dbSetup = require('./dbSetup');
	
	console.log("");
	console.log("_____________ Running All Tests ____________");
	
	async.series([
		function(callback) {
			console.log("");
			utilTest.runTest(callback);
		},
		function(callback) {
			console.log("");
			gameTest.runTest(callback);
		},
		function(callback) {
			console.log("");
			expressTest.runTest(callback);
		},
		function(callback) {
			console.log("");
			messageTest.runTest(callback);
		},
		function(callback) {
			console.log("");
			startTest.runTest(callback);
		},
	],
	function(err, results) {
		console.log("________ Tests Ended ______________");
		console.log("");
		mongoose.disconnect();
	});
}();