var setTheDB = function() {
	var mongoose = require('mongoose');
	mongoose.connect('localhost','MiS');
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	
	//setup db
	var dbSetup = require('./dbSetup');
	
	mongoose.disconnect();
	
	console.log("Finished");
}();