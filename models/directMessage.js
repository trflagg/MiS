	var _ = require('../libs/underscore-min');

	/****************/
	/* DirectMessage 
	/***************/
module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	var MessageProps = require('../models/message')(mongoose).MessageProps;
	
	var DirectMessageProps = {
		from			: String,
		date			: String
	};
	_.extend(DirectMessageProps, MessageProps);
	var DirectMessageSchema = new Schema(DirectMessageProps);

	
	modelObject.DirectMessage = mongoose.model('DirectMessage', DirectMessageSchema);
	return modelObject;
}