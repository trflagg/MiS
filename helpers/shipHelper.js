module.exports = function (service) {
	
	var Ship = service.useModel('game').Ship;
	var System = service.useModel('system').System;
	var Location = service.useModel('location').Location;
	var ShipCommand = service.useModel('shipCommand').ShipCommand;
	var Quest = service.useModel('quest').Quest;
	
	var helper = {};
	
	
	helper.runMessage = function(ship, message) {
		var text = "";
		var inBrackets = false;
		var bracketText = "";
		//loop through every character
		for (i in message)
		{
			var c = message[i];
			if (inBrackets)
			{
				if(c == ']')
				{
					inBrackets = false;
					//process bracketText
				}
			}
			else
			{
				if(c == '[')
				{
					inBrackets = true;
					bracketText = "";
				}
				else
					text = text.concat(c);
			}
		}
		ship.lastMessageText = text;
		return ship;
	};
	
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
		Location
		.findOne({name : locationName})
		.populate('locationType')
		.exec(function(err, foundLocation) {
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
					
					//run location's message
					helper.runMessage(ship, foundLocation.message);
					
					//add location's default commands to ship
					var defaultShipsCommands = foundLocation.locationType.defaultShipCommands;
					
					ShipCommand
					.find({'_id': {$in : defaultShipsCommands}})
					.exec(function(err, foundCommands) {
						if (err) callback(err, null);
						else
						{
							for (i in foundCommands)
							{
								var command = foundCommands[i];
								ship.commands.push(command);
							}
							ship.save(function(err) {
								if (err) callback(err, null);
								else 
								{
									//console.log(location);
									callback(null,ship);
								}
							});
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
			header : {
				text : "SS. " + ship.name,
			},
			locationHeader : {
				locationName : ship.location.name,
				description : ship.location.description,
			},
			commands : [],
			content : ship.lastMessageText,
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
		
		//setup commands
		if (ship.location.locationType.showControls)
		{
			pageUI.commands.push({ text: "Weapons", url: "/controls/weapons/0"});
			pageUI.commands.push({ text: "Shields", url: "/controls/shields/0"});
			pageUI.commands.push({ text: "Sensors", url: "/controls/sensors/0"});
			pageUI.commands.push({ text: "Databank", url: "/controls/databank/0"});
			pageUI.commands.push({ text: "Processor", url: "/controls/processor/0"});
		}
		
		if (ship.location.locationType.showCrew)
		{
			pageUI.commands.push({ text: "Security", url: "/crew/security/0"});
			pageUI.commands.push({ text: "Medical", url: "/crew/medical/0"});
			pageUI.commands.push({ text: "Info", url: "/crew/info/0"});
			pageUI.commands.push({ text: "Empat", url: "/crew/empat/0"});
			pageUI.commands.push({ text: "Engineering", url: "/crew/engineering/0"});
			pageUI.commands.push({ text: "Cultural", url: "/crew/cultural/0"});
		}
	
		for (i in ship.commands.toObject())
		{
			var command = ship.commands[i];
			newCommand = {
				text : command.text, 
				url : "/ship/"+i,
			},
			pageUI.commands.push(newCommand)
		}
		
		pageUI.commands.push({ text : "Glossary", url: "/glossary/"});
		
		return pageUI
	}
	
	return helper;
}