module.exports.runTest = function(callback) {
 var assert = require('assert'),
	mongoose = require('mongoose');
	
	console.log("BEGIN MessageTest");
	var endTest = function() {
		console.log("END MessageTest");
		callback();
	};
	
	//connect to mongoose
	//mongoose.connect('localhost','test');
	//mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	
	//load models
	var message = require('../models/directMessage')(mongoose);
	
	
	//drop message table
	mongoose.connection.collections['directmessages'].drop();
	
	//make new direct message
	var directMessage = new message.DirectMessage({
		subject	: "Upon arrival at Struven",
		from	: "Arthurian Delegation",
		date	: "35811412",
		text	: "Captain,78 hours ago, a 22 year-old Kruger female was reported dead in her dorm room by her roommate, a 22 year-old Arthurian female."});
	directMessage.on('error', function() {
		console.error.bind(console, 'directMessage error:');
		endTest();
	});
	
	directMessage.save();
	
	
	endTest();	
	
	
	
}