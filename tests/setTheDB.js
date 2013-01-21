var setTheDB = function() {
	
	//test argument?
	if (process.argv[2] && process.argv[2] == "-test")
	{
		//connect to testdb
		var testArg = true;
		console.log("testArg = true");
		var environment = require('../environment-test');
	}
	else
	{
		var testArg = false;
		var environment = require('../environment');
	}

	//load service based on environment
	var	service = require('../service');
	service.init(environment);
	var mongoose = service.getMongoose();

	//define models for mongoose
	require('../models')(service.getMongoose());
	//setup db
	var dbSetup = require('./dbSetup')(service, function() {
	
		mongoose.disconnect();
	
		console.log("Finished");
	});
}();