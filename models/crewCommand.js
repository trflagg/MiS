var _ = require('../libs/underscore-min');

	/****************/
	/* DirectMessage 
	/***************/
module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	var MessageProps = require('../models/message')(mongoose).MessageProps;
	
	var CrewCommandProps = {
		control			: String,
		name			: String,
	};
	CrewCommandProps = _.extend(CrewCommandProps, MessageProps);
	var CrewCommandSchema = new Schema(CrewCommandProps);

	modelObject.CrewCommand = mongoose.model('CrewCommand', CrewCommandSchema);
	return modelObject;
}