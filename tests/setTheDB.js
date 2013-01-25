var setTheDB = function() {
	

	var testArg = false;
	var devArg = false;
	if (process.argv[2] && process.argv[2] == "-test")
	{
		//connect to testdb
		testArg = true;
		console.log("testArg = true");
		var environment = require('../environment-test');
	}
	else if (process.argv[2] && process.argv[2] == "-prod")
	{
		var environment = require('../environment-prod');
	}
	else
	{
		devArg = true;
		console.log("devArg = true");
		var environment = require('../environment-dev');
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