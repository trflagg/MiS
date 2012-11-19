
module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema;

	/*********************/
	/* CrewMember		 */
	var positions = ["securityOfficer", "medicalOfficer", "empat", "engineeringOfficer", "culturalExpert", "informationOfficer"];
	
	var CrewMemberSchema = new Schema({
		name			: { type: String },
		level			: { type: Number, default: 1 },
		position		: { type: String, enum: positions },
		
		
	});
	modelObject.CrewMember = mongoose.model('CrewMember', CrewMemberSchema);


	/***************/
	/* ShipControl */
	var controls = ["weapons", "shields", "sensors", "databank", "processors"];
	
	var ShipControlSchema = new Schema({
		level			: {type: Number, default: 1},
		
	});
	modelObject.ShipControl = mongoose.model('ShipControl', ShipControlSchema);	
	

	/*************/
	/* Ship		 */
	var ShipSchema = new Schema({
		
		//list for all global variables
		globals			: {},
		
		//Location
		location		: Schema.Types.ObjectId,
		
		//To be filled with a ShipControl subdocument
		weapons			: {  },
		shields			: {  },
		sensors			: {  },
		databank		: {  },
		processors		: {  },
		
		//To be filled with a CrewMember subdocument
		securityOfficer		: {  },
		medicalOfficer		: {  },
		empat				: {  },
		engineeringOfficer	: {  },
		culturalExpert		: {  },
		informationOfficer	: {  },
		
	});
	
	ShipSchema.methods.addShipControl = function(controlName, control) {
		this[controlName] = control;
		return this;
	};
	
	ShipSchema.methods.addCrewMember = function(position, member) {
		this[position] = member;
		return this;
	};
	
	
	modelObject.Ship = mongoose.model('Ship', ShipSchema);



	/**************/
	/* GameSchema */
	var GameSchema = new Schema({
		dateStarted		: { type: Date },
		captain			: { type: String, required: true },
		
		//Array of Ship Documents
		ships			: [ { } ], 
	});
	
	
	modelObject.Game = mongoose.model('Game', GameSchema);
	
	
	return modelObject;
};