 var assert = require('assert'),
	mongoose = require('mongoose');

module.exports.runTest = function(callback) {

	console.log("BEGIN UtilTest");
	
	//test assert.
	console.log("BEGIN Assert");
	assert(true, "testing assert");
	assert.ok(true, "testing assert.ok");
	var x = 1;
	assert.equal(x, 1, "testing assert.equal");
	assert.notEqual(x, 2, "testing assert.notEqual");
	console.log("END Assert");
	
	
	//test mongoose
	console.log("BEGIN Mongoose");
    var checkConnectionExists = (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2);
    if(!checkConnectionExists)
	{
		mongoose.connect('localhost','testdb');
		mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	}
	
	//if default connection is active, readyState will be 1 or 2
	assert.notEqual(mongoose.connection.readyState, 0, "Default connection not active. readyState = 0");
	assert.notEqual(mongoose.connection.readyState, 3, "Default connection not active readyState = 3");
	console.log("Default Connection Established.");
	
	db = mongoose.createConnection('localhost', 'testdb');
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		
		//if new connection is active, readyState will be 1 or 2
		assert.notEqual(db.readyState, 0, "New connection not active. readyState = 0");
		assert.notEqual(db.readyState, 3, "New connection not active readyState = 3");
		console.log("New Connection Established.");
		
		db.close();
		
		//if default connection is still active, readyState will be 1 or 2
		assert.notEqual(mongoose.connection.readyState, 0, "Default connection no longer active. readyState = 0");
		assert.notEqual(mongoose.connection.readyState, 3, "Default connection no longer active readyState = 3");
		
		//test disconnect
		mongoose.disconnect(function() {		
			//if default connection is disconnect(ed, ing) readyState will be 0 or 3
			assert.notEqual(mongoose.connection.readyState, 1, "Default connection did not disconnect. readyState = 1");
			assert.notEqual(mongoose.connection.readyState, 2, "Default connection did not disconnect. readyState = 2");
			console.log("Default Connection Still Established.");
		
			console.log("END Mongoose");
			endTest();	
		});
	});
	
	var endTest = function() {
		console.log("END UtilTest");
		callback();
	};
	
}