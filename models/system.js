var _ = require('../libs/underscore-min');

	/****************/
	/* System 
	/***************/
module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	var MessageProps = require('../models/message')(mongoose).MessageProps;
	
	var SystemProps = {
		name				: { type: String, required : true},
		description			: { type: String, required : true},
		locationName 		: String,
	};
	SystemProps = _.extend(SystemProps, MessageProps);
	var SystemSchema = new Schema(SystemProps);

	modelObject.System = mongoose.model('System', SystemSchema);
	return modelObject;
}