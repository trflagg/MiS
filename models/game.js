
module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	/**
	 * MessageContainer
	 */
	
	/*********************/
	/* CrewMember		 */
	var positions = ["securityOfficer", "medicalOfficer", "empat", "engineeringOfficer", "culturalExpert", "informationOfficer"];
	
	var CrewMemberSchema = new Schema({
		name			: { type: String },
		level			: { type: Number, default: 1 },
		position		: { type: String, enum: positions },
		
		commands		: [{ }],
		
	});
	modelObject.CrewMember = mongoose.model('CrewMember', CrewMemberSchema);


	/***************/
	/* ShipControl */
	var controls = ["weapons", "shields", "sensors", "databank", "processors"];
	
	var ShipControlSchema = new Schema({
		level			: {type: Number, default: 1},
		
		commands		: [{ }],
		
	});
	modelObject.ShipControl = mongoose.model('ShipControl', ShipControlSchema);	
	


	/**************/
	/* GameSchema */
	var GameSchema = new Schema({
		dateStarted		: { type: Date },
		name			: { type: String, required: true },
		handed			: { type: String, default: 'right'},
		
		//Array of Ship Ids
		ships			: [ { } ], 
	});
	
	
	modelObject.Game = mongoose.model('Game', GameSchema);
	
	
	return modelObject;
};