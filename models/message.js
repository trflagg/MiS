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
		text			: String,
		subject			: String
	};
	
	return modelObject;
};