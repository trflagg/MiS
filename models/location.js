var _ = require('../libs/underscore-min');
	
module.exports = function (mongoose) {
	var modelObject = {};

	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;
	var MessageProps = require('../models/message')(mongoose).MessageProps;
	
	/**
	 * LocationType
	 */
	var LocationTypeSchema = new Schema({
		name 				: String,
		defaultShipCommands	: [ObjectId],
		showControls		: {type: Boolean, default: false},
		showCrew			: {type: Boolean, default: false},
	});
	modelObject.LocationType = mongoose.model('LocationType', LocationTypeSchema);

	/**
	 * Location
	 */
	LocationProps = {
		name				: { type: String, required : true},
		description			: { type: String, required : true},
		locationType		: { type: ObjectId, required : true, ref: 'LocationType' },
		colors				: [{
								value 		: String,
								name 		: String,
								selectors 	: [{
												selector : String,
												property : String
												}]
								}],
	};
	modelObject.LocationProps = _.extend(LocationProps, MessageProps);
	var LocationSchema = new Schema(LocationProps);
	modelObject.Location = mongoose.model('Location', LocationSchema);

	return modelObject;
};