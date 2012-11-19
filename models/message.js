	var _ = require('../libs/underscore-min');

module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	/*************/
	/* Message	
	/************/
	var MessageProps = {
		text			: String,
		subject			: String
	};
	var MessageSchema = new Schema(MessageProps);
	modelObject.Message = mongoose.model('Message', MessageSchema);
	
	return modelObject;
};