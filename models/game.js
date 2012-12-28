
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
		
		messages		: [{ }],
		
	});
	modelObject.CrewMember = mongoose.model('CrewMember', CrewMemberSchema);


	/***************/
	/* ShipControl */
	var controls = ["weapons", "shields", "sensors", "databank", "processors"];
	
	var ShipControlSchema = new Schema({
		level			: {type: Number, default: 1},
		
		messages		: [{ }],
		
	});
	modelObject.ShipControl = mongoose.model('ShipControl', ShipControlSchema);	
	

	/*************/
	/* Ship		 */
	var ShipSchema = new Schema({
		
		//list for all global variables
		globals			: {},
		
		//name
		name			: {type: String},
		
		//To be filled with a ShipControl subdocument
		weapons			: {  },
		shields			: {  },
		sensors			: {  },
		databank		: {  },
		processors		: {  },
		
		//To be filled with a CrewMember subdocument
		security			: {  },
		medical				: {  },
		empat				: {  },
		engineering			: {  },
		cultural			: {  },
		info				: {  },
		
		//system
		system			: {},
		
		//Location
		location		: {},
		
		//current quest
		quest 			: {},
		
		//direct messages
		directMessages : [{
			id : Schema.Types.ObjectId,
			read : Boolean
		}],
		
		//message just previously run
		lastMessage : String,
	});
	
	
	modelObject.Ship = mongoose.model('Ship', ShipSchema);



	/**************/
	/* GameSchema */
	var GameSchema = new Schema({
		dateStarted		: { type: Date },
		name			: { type: String, required: true },
		
		//Array of Ship Documents
		ships			: [ { } ], 
	});
	
	
	modelObject.Game = mongoose.model('Game', GameSchema);
	
	
	return modelObject;
};