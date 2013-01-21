

module.exports.runTest = function(callback) {

 var assert = require('assert');

	console.log("BEGIN shipTest");
	var endTest = function() {
		console.log("END shipTest");
		if (callback) {
			return callback();
		}
		
		mongoose.disconnect();
	};
	
	//connect to mongoose
	var environment = require('../environment');

	//load service based on environment
	var	service = require('../service');
	service.init(environment);
	var mongoose = service.getMongoose();

	//define models for mongoose
	require('../models')(service.getMongoose());	
	var Ship = service.useModel('Ship');
	var CrewMember = service.useModel('CrewMember');
	var ShipControl = service.useModel('ShipControl');
	var ShipCommand = service.useModel('ShipCommand');
	
	//load helper
	var shipHelper = require('../helpers/shipHelper')(service);
	
	//make new ship
	/*
	shipHelper.newShip({
		shipName : "Yamato",
		security : "Warf",
		medical : "Crusher",
		info: "Data",
		empat: "Troi",
		engineering: "LaForge",
		cultural: "Picard"
	}, function(err, ship) {
		if (err) {
			console.log("ERROR: "+err);
			return endTest();
		}
	*/
	var params = {
		shipName : "Yamato",
		security : "Warf",
		medical : "Crusher",
		info: "Data",
		empat: "Troi",
		engineering: "LaForge",
		cultural: "Picard"
	};
	
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
		 	console.log(err);
		}
	
		assert.equal(newShip.name, "Yamato", "shipHelper.newShip: newShip.name not correct. newShip.name = "+newShip.name);
		assert.notEqual(newShip._id, undefined, "newShip._id is undefined");
		
		//add command
		newShipCommand2 = new ShipCommand({
			name : "WEAP_NOT_RED_ALERT",
			control : "weapons",
			text : "Fire",
			message : "Weapons may only be fired when at Red Alert."
		});
		newShipCommand2.save(function(err) {
			if (err) {
				console.log(err);
				endTest();
			}
		
			Ship.findByIdAndUpdate(newShip._id, { $push : { 'controls.weapons.commands' : newShipCommand2.toJSON() }}, function(err, newShip2) {
				//grab ship from db to check it saved
				Ship.findById(newShip._id, 'controls.weapons', function(err, ship2) {
					if (err) {
						console.log(err);
						endTest();
					}
					var weaponCommandName = ship2.controls.weapons.commands[0].name;
					assert.equal(weaponCommandName, "WEAP_NOT_RED_ALERT", "saved ship's weapon command name incorrect. name="+weaponCommandName);
					
					//add quest
					shipHelper.setQuest(ship2._id, "Murder on Struven", function(err, ship3) {
						//grab ship from db to check it saved
						Ship.findById(ship3._id, 'quest', function(err, ship4) {
							if (err) {
								console.log(err);
								endTest();
							}
							assert.equal(ship4.quest.name, "Murder on Struven", "saved ship's quest name incorrect. name="+ship4.quest.name);
							
							//add Location
							shipHelper.setLocation(ship4._id, "Struven IV", function(err) {
								if (err) {
									console.log(err);
									endTest();
								}
									
								Ship.findById(ship4._id, '', function(err, ship5) {
									if (err) {
										console.log(err);
										endTest();
									}
									assert.equal(ship5.location.name, "Struven IV", "saved ship's location name incorrect. name="+ship5.location.name);
									console.log(ship5);
									var pageUI = shipHelper.getPageUI(ship5);
									console.log(pageUI);
									console.log(pageUI.commands[0].subcommands);
									console.log(pageUI.commands[1].subcommands);
									endTest();
								});
							});
						});
					});
				});
			});
		});
		
		/*
		var pageUI = shipHelper.getPageUI(ship);
		console.log(pageUI);
		assert.equal(pageUI.commands.length, 4, "pageUI.commands.length != 4.  pageUI.commands.length = "+pageUI.commands.length);
		
		var pageUI = shipHelper.getPageUIById(ship._id, function(err, pageUI) {
			if (err) {
				console.log("ERROR: "+err);
				return endTest();
			}
			
			assert.equal(pageUI.commands.length, 4, "getPageUIById!!! pageUI.commands.length != 4.  pageUI.commands.length = "+pageUI.commands.length);
			
			console.log("&*&***&**&&**&");
			console.log(pageUI);
			endTest();
		});
		*/
	});
}();
