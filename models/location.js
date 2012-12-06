
module.exports = function (mongoose) {
	var modelObject = {};

	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	modelObject.LocationProps = {
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
		message				: ObjectId,
	};

	return modelObject;
};