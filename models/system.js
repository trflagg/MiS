var _ = require('../libs/underscore-min');

	/****************/
	/* System 
	/***************/
module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	var LocationProps = require('../models/location')(mongoose).LocationProps;
	
	var SystemProps = {
		
	};
	SystemProps = _.extend(SystemProps, LocationProps);
	var SystemSchema = new Schema(SystemProps);

	modelObject.System = mongoose.model('System', SystemSchema);
	return modelObject;
}