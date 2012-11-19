
module.exports = function (mongoose) {
	var modelObject = {};

	var Schema = mongoose.Schema;


	/*****************/
	/* Script		 */
	var operationList = ["set", "exit"]
	var ScriptSchema = new Schema({
		operation: 	{ type: String, enum: operationList },
		lside: 		{ type: String },
		rside: 		{ type: String },
	});
	
	
	/*****************/
	/* Card			 */
	var CardSchema = new Schema({
		text			: { type: String },
		commands		: [{ 
							text: String,
							script: [ScriptSchema],
							}],
	});
	modelObject.Card = mongoose.model('Card', CardSchema);

	return modelObject;
};