var _ = require('../libs/underscore-min');
	
module.exports = function (mongoose) {
	var modelObject = {};

	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;
	var MessageProps = require('../models/message')(mongoose).MessageProps;

	LocationProps = {
		name				: { type: String, required : true},
		description			: { type: String, required : true},
		colors				: [{
								value 		: String,
								name 		: String,
								selectors 	: [{
												selector : String,
												property : String
												}]
								}],
		type			: { type: String, required : true},
	};
	modelObject.LocationProps = _.extend(LocationProps, MessageProps);
	var LocationSchema = new Schema(LocationProps);

	modelObject.Location = mongoose.model('Location', LocationSchema);

	return modelObject;
};