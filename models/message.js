	var _ = require('../libs/underscore-min');

module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	/*************/
	/* Message	
	 * Abstract Class
	/************/
	modelObject.MessageProps = {
		text			: {type : String, required : true},
		subject			: {type : String, required : true},
		messageId		: {type : String, required : true}
	};
	
	return modelObject;
};