
module.exports = function (mongoose) {
	var modelObject = {};
	var Schema = mongoose.Schema
	  , ObjectId = Schema.ObjectId;

	/*************/
	/* Ship		 */
	var ShipSchema = new Schema({

		name			: {type: String},
		
		controls 		: {
			//To be filled with a ShipControl subdocument
			weapons			: {  },
			shields			: {  },
			sensors			: {  },
			databank		: {  },
			processor		: {  },
		},
		
		crew			: {
			//To be filled with a CrewMember subdocument
			security			: {  },
			medical				: {  },
			empat				: {  },
			engineering			: {  },
			cultural			: {  },
			info				: {  },
		},
		
		commands		: [{}],
		
		system			: {},
		
		location		: {},
		
		quest 			: {},
		
		//list for all global variables
		globals			: {},
		
		directMessages : [{
			id : Schema.Types.ObjectId,
			read : Boolean
		}],
		
		//text of message just previously run
		lastMessageText : String,
		
		
		
	});
	
	
	modelObject.Ship = mongoose.model('Ship', ShipSchema);
	
	return modelObject;
};