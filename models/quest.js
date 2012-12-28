	var _ = require('../libs/underscore-min');

module.exports = function (mongoose) {
	var modelObject = {};

	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	var MessageProps = require('../models/message')(mongoose).MessageProps;
	
	var QuestProps = {
		name				: String,
		description			: String,
	};
	QuestProps = _.extend(QuestProps, MessageProps);
	var QuestSchema = new Schema(QuestProps);


	modelObject.Quest = mongoose.model('Quest', QuestSchema);

	return modelObject;
};