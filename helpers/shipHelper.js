module.exports = function (service) {
	var EventEmitter = require('events').EventEmitter;
	
	var async = require('async');
	
	var ShipUpdate = require('./ShipUpdate')(service);
	
	var Ship = service.useModel('Ship');
	var CrewMember = service.useModel('CrewMember');
	var ShipControl = service.useModel('ShipControl');
	var System = service.useModel('System');
	var Location = service.useModel('Location');
	var ShipCommand = service.useModel('ShipCommand');
	var Quest = service.useModel('Quest');
	
	//var messageHelper = require('./messageHelper')(service);
	
	var helper = {};
	
	/** setQuest()
	 */
	helper.setQuest = function(ship_id, questName, callback) {
		//look up quest
		console.log(ship_id);
		Quest.findOne({name : questName}, function(err, quest) {
			if (err) {
				console.log("setQuest: Error in Quest.findOne: " + err);
				if (typeof callback === 'function') {
					callback(err, null);
				}
				return;
			}
			
			if (!quest) {
				console.log("setQuest: Cannot find quest "+questName);
				if (typeof callback === 'function') {
					callback("Cannot find quest "+questName, null);
				}
				return;
			}
			
			if (typeof callback === 'function') {
				Ship.findByIdAndUpdate(ship_id, { $set : {quest : quest.toJSON()  }}, function(err, ship) {
					if (err) {
						console.log("setQuest: Error in Ship.findByIdAndUpdate: " + err);
						return callback(err, null);
					}
					console.log(ship);
					return callback(null, ship);
				});
			}
			else {
				Ship.findByIdAndUpdate(ship_id, { $set : {quest : quest }});
			}	
		});
	};

	/** setLocation()
	 * unlike setQuest, callback is required.
	 */	
	helper.setLocation = function(ship_id, locationName, callback) {
		//look up location
		Location.findOne({name : locationName})
		.populate('locationType')
		.exec(function(err, foundLocation) {
			if (err) {
				console.log("setLocation: Error in Location.findOne: " + err);
				return callback(err, null);
			}
			
			if (!foundLocation) {
				console.log("setLocation: Cannot find location "+locationName);
				return callback("Cannot find location "+locationName, null);
			}
			
			// run these one after another
			// this is inefficient because we're doing multiple db calls
			// an idea for improvement is to have the functions return
			// mongoose query objects & execute at the end.
			async.series({
				setLocation: function(callback) {
					Ship.findByIdAndUpdate(ship_id, { $set: { 'location': foundLocation.toJSON() }}, function(err) {
						callback(err);
					});
				},
				
				runMessage: function(callback) {
					helper.runMessage(ship_id, foundLocation.message, function(err) {
						callback(err);
					});
				},
				
				defaultCommands: function(callback) {
					var defaultShipsCommands = foundLocation.locationType.defaultShipCommands;
			
 					//check for all default commands.
 					ShipCommand
 					.find({'_id': {$in : defaultShipsCommands}})
 					.exec(function(err, foundCommands) {
						callback(err);
						/*
 						if (err) { 
 							console.log("setLocation: Error in ShipCommand.find: " + err);
 							return callback(err);
 						}
 						
						// now use async to add a parallel array inside our series
						// that adds every default command
						var parallelArray = [];
 						for (var i=0, ll=foundCommands.length; i<ll; i++)
 						{
 							var command = foundCommands[i];

							parallelArray.push( function(innerCallback) {
 								console.log('command:'+command);
								
 								helper.addShipCommand(ship_id, command, function(err) {
									innerCallback(err);
								});
							});
 						}
						async.parallel(parallelArray, function(err, results) {
							callback(err);
						});
						*/
 					});
				},
			},	
			
			// our series is complete, run this callback:
			function(err, results) {
				if (err) {
					console.log("setLocation: Error in async.series: " + err);
					return callback(err);
				}
		
				// success!
				return callback(null);
			});
		});
	};
	
	helper.saveShip = function(ship, callback) {
		ship.save(function(err) {
			if (err) {
				return callback(err, null);
			}
			
			console.log("SAVED SHIP:"+ship);
  			//console.log(location);
  			callback(null, ship);
		});
	};
	
	// callback is required because it is required for setLocation
	helper.setSystem = function(ship_id, systemName, callback) {
		//look up system
		System.findOne({'name' : systemName},  function(err, foundSystem) {
			if (err)  {
				return callback(err, null);
			}
			if (!foundSystem) {
				return callback("Cannot find system "+systemName, null);
			}
			
			
			Ship.findByIdAndUpdate(ship_id, { $set : {'system' : foundSystem.toJSON()  }}, function(err, ship) {
				if (err) {
					console.log("setSystem: Error in Ship.findByIdAndUpdate: " + err);
					return callback(err, null);
				}
				//set location from system
				return helper.setLocation(ship_id, foundSystem.locationName, callback);
			});
		});
	};
	
	/** 
	 * addShipCommand()
	 * callback can be either function or queryObject
	 */
	helper.addShipCommand = function(ship_id, controlName, commandText, commandName, callbackOrUpdateObject) {
		
		// callback may be function or array to add updates to
		var callback = callbackOrUpdateObject;
		if (typeof callback == "object") {
			shipUpdate = callback;
			callback = null;
		}
		
		//TODO: should I make some kind of Command object for this? 
		// I probably will want if I have to add more.
		var commandObject = {
			text : commandText,
			name : commandName
		}
		
		// command is for a ship control
		// TODO: this is really bad hardcoding, I know
		// I PROMISE to fix it later.
		if (controlName == "weapons" ||
			controlName == "shields" ||
			controlName == "sensors" ||
			controlName == "databank" ||
			controlName == "processor") 
		{	
			var pushList = {}
			pushList['controls.'+controlName+'.commands'] = commandObject;
			
			if (callback) {
				return Ship.findByIdAndUpdate(ship_id, { $push : pushList }, callback);
			}
			shipUpdate.getQueryObject().update({ $push : pushList });
			return;
		}
		
		// command is for the ship in general
		else if (controlName == "ship") {
			if (callback) {
				return Ship.findByIdAndUpdate(ship_id, { $push : { 'commands' : commandObject } }, callback);
			}
			shipUpdate.getQueryObject().update({ $push : { 'commands' : commandObject } });
			return;
		}
		
		// not valid
		else {
			if (callback) {
				return callback("controlName '"+controlName + "' is invalid", null);
			}
			return "controlName '"+controlName + "' is invalid";
		}
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
		var colorList = ship.location.colors;
		for (var i =0, ll=colorList.length; i<ll; i++ )
		{
			var color = colorList[i];
			newColor = {};
			newColor.value = color.value;
			newColor.selectors = {};
			var selectorList = color.selectors;
			for (var j=0, ll2 = selectorList.length; j<ll2; j++)
			{
				var selector = color.selectors[j];
				newColor.selectors[selector.selector] = selector.property;
			}
			pageUI.colors.push(newColor);
		}
		
		//setup commands
		if (ship.location.locationType.showControls)
		{
			//check list of commands for each control 
			var controls = ship.controls;
			var controlNames = ["weapons","shields","sensors","databank","processor"];
			for (var i=0,ll=controlNames.length; i<ll; i++)
			{
				var name = controlNames[i];
				var commands = controls[name].commands;
				//console.log("control name:"+name);
				//console.log("controls[name]:"+controls[name]);
				//console.log("commands: "+commands);
				//if there are any
				if (commands && (commands.length > 0))
				{
					// make the control object, a subcommand for each item in the list
					// and add it to the UI
					var objUI = { text: name, subcommands: [] };
					for (var j=0, ll2 = commands.length; j < ll2; j++)
					{
						objUI.subcommands.push({ text: commands[j].text, url: "/controls/"+name+"/"+j });
					}
					pageUI.commands.push(objUI);
				}
			}
		}
		
		if (ship.location.locationType.showCrew)
		{
			//check list of commands for each crew member 
			for (var key in ship.crew)
			{
				var commands = ship.crew[key].commands;
				//if there are any
				if (commands.length > 0)
				{
					// make the control object, a subcommand for each item in the list
					// and add it to the UI
					var objUI = { text: key };
					for (var i=0, ll = commands.length; i < ll; i++)
					{
						objUI.subcommands.push({ text: commands[i].text, url: "/crew/"+key+"/"+i });
					}
					pageUI.commands.push(objUI);
				}
			}
			
		}
	
		// also add a command for every item in ship.commands
		var shipCommands = ship.commands.toObject();
		for (var i=0, ll=shipCommands.length; i < ll; i++)
		{
			var command = shipCommands[i];
			newCommand = {
				text : command.text, 
				url : "/controls/ship/"+i,
			},
			pageUI.commands.push(newCommand)
		}
		
		pageUI.commands.push({ text : "Glossary", url: "/controls/glossary/0"});
		
		return pageUI
	}
	
	/** getPageUIById(shipId, callback)
	 * For when you haven't loaded the ship yet.
	 */
	helper.getPageUIById = function(shipId, callback) {
		Ship.findById(shipId)
		.exec(function(err, foundShip) {
			if (err) {
				console.log("error in getPageUIById: "+err);
				return callback(err, null);
			}
			
			// success! return result of getPageUI
			callback(null, helper.getPageUI(foundShip));
		});
	}
	
	helper.newShip = function(params, callback) {
		//create new ship
		Ship.create({
					name : params.shipName,
					crew : {
						security : new CrewMember({ name : params.security }),
						medical : new CrewMember({ name : params.medical }),
						info : new CrewMember({ name : params.info }),
						empat : new CrewMember({ name : params.empat }),
						engineering : new CrewMember({ name : params.engineering }),
						cultural : new CrewMember({ name : params.cultural }),
					},
					controls : {
						weapons : new ShipControl(),
						shields : new ShipControl(),
						sensors : new ShipControl(),
						databank : new ShipControl(),
						processor : new ShipControl(),
					},
		}, function(err, newShip) {
			if (err) {
				return callback(err, null);
			}
			var shipId = newShip._id
			
			//set starting location
			helper.setSystem(shipId, "Struven", function(err) {
				if (err) {
					console.log("Error in setSystem: "+err);
					return callback(err, ship);
				}
				
				//set starting quest
				helper.setQuest(shipId, "Murder on Struven", function(err,ship) {
					if (err) {
						console.log("Error in setQuest: "+err);
						return callback(err, ship);
					}
					//success!
					callback(null, ship);
				});
					
			});
		});
	}
	
	/** 
	 * MessageHelper functions
	 */
	runMessageFunction = function(ship_id, func, params, shipUpdate)
	{
		switch(func)
		{
			// ADD_SHIP_COMMAND( controlName, commandText, commandName)
			case "ADD_SHIP_COMMAND":
				var result = helper.addShipCommand(ship_id, params[0], params[1], params[2], shipUpdate);
				break;
		}
		
		if (typeof result == "string") {
			//error
			console.log("Error in runMessageFunction: "+result);
		}
		
		return result;
	};
	
	processMessageFunction = function(ship_id, text, shipUpdate)
	{
		console.log("text:" + text);
		
		//get function 
		var funcSplit = text.split("("),
			func = funcSplit[0],
			//cut off last ) and separate by ,s
			params = funcSplit[1].substr(0, funcSplit[1].length-1).split(",");
		console.log("func:"+func);
		console.log("params:"+params);
		
		//check function
		return runMessageFunction(ship_id, func, params, shipUpdate);
		
	};
	
	
	helper.runMessage = function(ship_id, message, callbackOrUpdateObject) {
		var text = "";
		var inBrackets = false;
		var bracketText = "";
		
		var shipUpdate = new ShipUpdate(ship_id);
		var queryObject = Ship.findById(ship_id);
		var updateObject = {};
		
		// callback may be function or array to add updates to
		var callback = callbackOrUpdateObject;
		if (typeof callback == "object") {
			updateObject = callback;
			callback = null;
		}
		
		//loop through every character
		for (i in message)
		{
			var c = message[i];
			if (inBrackets)
			{
				if(c == ']')
				{
					inBrackets = false;
					var result = processMessageFunction(ship_id, bracketText, shipUpdate);
				}
				else
					bracketText = bracketText.concat(c);
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
		
		// check for error
		if (typeof result == "string") {
			console.log("Error in runMessage. error: "+result+". message: "+message);
			if (typeof callback == "function") {
				callback("Error in runMessage. error: "+result+". message: "+message, null);
			}
			return null;
		}
		
		// success
		queryObject = shipUpdate.getQueryObject().update({ $set : { 'lastMessageText' : text}})
		console.log('lastMessageText: '+text);
		
		if (typeof callback == "function") {
			queryObject.exec(function(err) {
				return callback(err, null);
			});
		}
		
		queryObject.exec();
		return shipUpdate;
	};
	
	return helper;
}