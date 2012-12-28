module.exports = function (service) {
	
	var Ship = service.useModel('game').Ship;
	var System = service.useModel('system').System;
	var Location = service.useModel('location').Location;
	var Quest = service.useModel('quest').Quest;
	
	var helper = {};
	
	helper.setQuestByName = function(ship, questName, callback) {
		//look up quest
		Quest.findOne({name : questName}, function(err, quest) {
			if (err) callback(err, null);
			
			ship.quest = quest;
			
			//console.log(quest);
			callback(null,ship);
		});
	};
	
	helper.setLocationByName = function(ship, locationName, callback) {
		//look up location
		Location.findOne({name : locationName}, function(err, foundLocation) {
			if (err) callback(err, null);
			
			ship.location = foundLocation;
			callback(null,ship);
		});
	};
	
	helper.setSystemByName = function(ship, systemName, callback) {
		//look up system
		System.findOne({name : systemName}, function(err, foundSystem) {
			if (err) callback(err, null);
			
			ship.system = foundSystem;
			helper.setLocationByName(ship, foundSystem.locationName, callback);
		});
	};
	
	helper.performCommand = function(type, name, number, callback) {
		var UIUpdates = {};
		
		callback(UIUpdates);
	};
	
	helper.getPageUI = function(ship) {
		var pageUI = {
			header : ship.name,
			locationHeader : {
				locationName : ship.location.name,
				description : ship.location.description,
			},
			commands : [],
			content : ship.location.message,
			colors : ship.location.colors,
		}
		
		return pageUI
	}
	
	return helper;
}