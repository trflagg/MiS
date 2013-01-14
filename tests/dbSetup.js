module.exports = function() {
	var mongoose = require('mongoose');

	var quest = require('../models/quest')(mongoose);
	var shipCommand = require('../models/shipCommand')(mongoose);
	var location = require('../models/location')(mongoose);
	var system = require('../models/system')(mongoose);
	
	//new quests
	mongoose.connection.collections['quests'].drop();
	
	newQuest = new quest.Quest({
		name : "Murder on Struven",
		message : "Welcome to 'Murder on Struven'",
		description : "Investigate the murder of a college student on Struven IV.",
	});
	newQuest.save();
	
	//shipCommand type
	mongoose.connection.collections['shipcommands'].drop();
	newShipCommand = new shipCommand.ShipCommand({
		name : "DIRECT_MESSAGE",
		text : "Direct Messages",
		message : "RUN_FUNCTION(DIRECT_MESSAGE)"
	});
	newShipCommand.save();
	
	//location type
	mongoose.connection.collections['locationtypes'].drop();
	newLocationType = new location.LocationType({
		name : "Orbit",
		showControls : true,
	});
	newLocationType.defaultShipCommands.push(newShipCommand._id);
	newLocationType.save();
	
	//new locations
	mongoose.connection.collections['locations'].drop();
	
	newLocation = new location.Location({
		name : "Struven IV",
		description : "Struven is one of the earliest settled systems. Its only planet, Struven IV, is known across the galaxy for its old architecture and institutes of higher learning.",
		message : 
		"Currently orbiting Struven IV. Shuttle and away team required for landing on planet. [ADD_SHIP_COMMAND(weapons,WEA_NON_FUNCTIONING)]",
		locationType : newLocationType._id,
		colors : [
			{
				value : "#999",
				name : "light",
				selectors : [
					{ selector : "body", property  : "color"},
					{ selector : "a", property  : "color"},
					{ selector : ":input", property  : "color"},
					{ selector : "textarea", property  : "color"},
					{ selector : "ul#commandList", property  : "color"},
					{ selector : "ul#commandList" , property : "border-color"},
					{ selector : "div.locationHeader p", property  : "color"},
					{ selector : ".locationHeader", property  : "border-color"},
					{ selector : ":input" , property : "border-color"},
					{ selector : "textarea", property  : "border-color"},
					{ selector : "ul#commandList a li", property  : "color"},
					{ selector : "ul#commandList li", property  : "border-color"},
					{ selector : ".header" , property : "color"},
				]
			},
			{
				
				value : "#000",
				name : "black",
				selectors : [
					{ selector : ":input", property  : "background"},
					{ selector : "textarea", property  : "background"},
					{ selector : ".locationHeader", property  : "background"},
					{ selector : "ul#commandList", property  : "background"},
				]
			},
		]
	});
	newLocation.save();
	
	//new systems
	mongoose.connection.collections['systems'].drop();
	newSystem = new system.System({
		name : "Struven",
		description : "Local planetary station. Friendly. Aquarii-leaning.",
		message : "The fourth planet is the only inhabitable planet of this system.",
		locationName : "Struven IV",
	});
	newSystem.save();
	
	
}();