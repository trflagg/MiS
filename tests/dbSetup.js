module.exports = function (service, moduleCallback) {
	
	var mongoose = service.getMongoose();
	
	var async = require('async');

	var Quest = service.useModel('Quest');
	var ShipCommand = service.useModel('ShipCommand');
	var Location = service.useModel('Location');
	var LocationType = service.useModel('LocationType');
	var System = service.useModel('System');
	
	//new quests
	console.log("Start dbSetup");
	async.waterfall([
		function(callback) {
			mongoose.connection.collections['quests'].drop();
			
			Quest.create({
				name : "Murder on Struven",
				message : "Welcome to 'Murder on Struven'",
				description : "Investigate the murder of a college student on Struven IV.",
			}, function(err) {
				console.log("saved quest");
				callback(err);
			});
		},
		
		function(callback) {	
			mongoose.connection.collections['shipcommands'].drop();
			newShipCommand = new ShipCommand({
				name : "DIRECT_MESSAGE",
				control : "ship",
				text : "Direct Messages",
				message : "[RUN_FUNCTION(DIRECT_MESSAGE)]"
			});
			newShipCommand.save(function(err) {
				console.log("saved shipcommand");
				callback(err);
			});
		},
		
		function(callback) {
			newShipCommand2 = new ShipCommand({
				name : "WEAP_NOT_RED_ALERT",
				control : "weapons",
				text : "Weapons",
				message : "Weapons may only be fired when at Red Alert."
			});
			newShipCommand2.save(function(err) {
				console.log("saved shipcommand");
				callback(err);
			});
		},
		
		function(callback) {
			newShipCommand3 = new ShipCommand({
				name : "SHIELD_RAISE",
				control : "weapons",
				text : "Raise Shields",
				message : "Shields up."
			});
			newShipCommand3.save(function(err) {
				console.log("saved shipcommand");
				callback(err);
			});
		},
		
		function(callback) {
			
			//location type
			mongoose.connection.collections['locationtypes'].drop();
			newLocationType = new LocationType({
				name : "Orbit",
				showControls : true,
			});
			//newLocationType.defaultShipCommands.push(newShipCommand._id);
			//newLocationType.defaultShipCommands.push(newShipCommand2._id);
			//newLocationType.defaultShipCommands.push(newShipCommand3._id);
			newLocationType.save(function(err, newLocationType) {
				console.log("saved locationType");
				callback(err, newLocationType._id);
			});
		},
		
		function(locationTypeId, callback) {
			
			//new locations
			mongoose.connection.collections['locations'].drop();
			
			newLocation = new Location({
				name : "Struven IV",
				description : "Struven is one of the earliest settled systems. Its only planet, Struven IV, is known across the galaxy for its old architecture and institutes of higher learning.",
				message : 
				"Currently orbiting Struven IV. Shuttle and away team required for landing on planet. [ADD_SHIP_COMMAND(weapons,Red Alert,WEAP_NOT_RED_ALERT)] [ADD_SHIP_COMMAND(ship,Subspace Communications,DIRECT_MESSAGE)] [ADD_SHIP_COMMAND(shields,Raise Shields,SHIELD_RAISE)]",
				locationType : locationTypeId,
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
							{ selector : "#locationHeader p", property  : "color"},
							{ selector : "#locationHeader", property  : "border-color"},
							{ selector : ":input" , property : "border-color"},
							{ selector : "textarea", property  : "border-color"},
							{ selector : "ul#commandList a li", property  : "color"},
							{ selector : "ul#commandList li", property  : "border-color"},
							{ selector : "#header" , property : "color"},
						]
					},
					{
						
						value : "#000",
						name : "black",
						selectors : [
							{ selector : ":input", property  : "background"},
							{ selector : "textarea", property  : "background"},
							{ selector : "#locationHeader", property  : "background"},
							{ selector : "ul#commandList", property  : "background"},
						]
					},
				]
			});
			newLocation.save(function(err) {
				console.log("saved location");
				callback(err);
			});
		},
		
		function(callback) {
			
			//new systems
			mongoose.connection.collections['systems'].drop();
			newSystem = new System({
				name : "Struven",
				description : "Local planetary station. Friendly. Aquarii-leaning.",
				message : "The fourth planet is the only inhabitable planet of this system.",
				locationName : "Struven IV",
			});
			newSystem.save(function(err) {
				console.log("saved system");
				callback(err);
			});
		},
	], 
	function(err, results) {
		if (err) {
			console.log("ERROR in dbSetup series: "+err);
		}
		console.log("End dbSetup");
		moduleCallback();
	});
	
	
};