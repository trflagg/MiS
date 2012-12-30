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
			else
			{
				if (quest === undefined)
				{
					callback("Cannot find quest "+questName, null);
				}
				else
				{
					ship.quest = quest;
					ship.save(function(err) {
						if (err) callback(err, null);
						else 
						{
							//console.log(quest);
							callback(null,ship);
						}
					});
				}
			}
		});
	};
	
	helper.setLocationByName = function(ship, locationName, callback) {
		//look up location
		Location.findOne({name : locationName}, function(err, foundLocation) {
			if (err) callback(err, null);
			else
			{
				if (foundLocation === undefined)
				{
					callback("Cannot find location "+locationName, null);
				}
				else
				{
					ship.location = foundLocation;
					ship.save(function(err) {
						if (err) callback(err, null);
						else 
						{
							//console.log(location);
							callback(null,ship);
						}
					});
				}
			}
			
		});
	};
	
	helper.setSystemByName = function(ship, systemName, callback) {
		//look up system
		System.findOne({name : systemName}, function(err, foundSystem) {
			if (err) callback(err, null);
			else
			{
				if (foundSystem === undefined)
				{
					callback("Cannot find system "+systemName, null);
				}
				else
				{
					ship.system = foundSystem;
					ship.save(function(err) {
						if (err) callback(err, null);
						else 
						{
							//set location from system
							helper.setLocationByName(ship, foundSystem.locationName, callback);
						}
					});
				}
			}
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
		}
		
		pageUI.colors = [];
		for (i in ship.location.colors)
		{
			var color = ship.location.colors[i];
			newColor = {};
			newColor.value = color.value;
			newColor.selectors = {};
			for (j in color.selectors)
			{
				var selector = color.selectors[j];
				newColor.selectors[selector.selector] = selector.property;
			}
			pageUI.colors.push(newColor);
		}
		
		return pageUI
	}
	
	return helper;
}