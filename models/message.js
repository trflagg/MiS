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
		message			: {type : String, required : true},
	};
	
	//var MessgeSchema = new Schema(modelObject.MessageProps);

	//modelObject.Message = mongoose.model('Message', MessgeSchema);
	
	return modelObject;
};