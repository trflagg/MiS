	var _ = require('../libs/underscore-min');

	/****************/
	/* DirectMessage 
	/***************/
module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	var MessageProps = require('../models/message')(mongoose).MessageProps;
	
	var ShipCommandProps = {
		control			: String,
		name			: String,
	};
	ShipCommandProps = _.extend(ShipCommandProps, MessageProps);
	var ShipCommandSchema = new Schema(ShipCommandProps);

	modelObject.ShipCommand = mongoose.model('ShipCommand', ShipCommandSchema);
	return modelObject;
}