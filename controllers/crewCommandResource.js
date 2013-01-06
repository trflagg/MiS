module.exports = function (app, service) {
	var CrewCommand = service.useModel('crewCommand').CrewCommand;
	var middleware = require('./middleware');
	var resource = {};

	/**
	 * index - GET /editor/crewCommand/
	 */
	resource.index = function(req, res){
		CrewCommand.find({}).select('subject id').exec(function(err, foundCommands, something) {
			if (err) 
			{ 
				res.send(500, "Error retrieving from database: "+err); 
			}
			res.render('./editor/crewCommand/crewCommandIndex', {'commands' : foundCommands} );
		});
	};

	/**
	 * new - GET /editor/crewCommand/new
	 */	
	resource.new = function(req, res){
		res.render('./editor/crewCommand/crewCommandForm', {
					title : "New Crew Command",
					formMethod : "POST",
					formAction : "/editor/crewCommand/"});
	};
	
	/**
	 * create - POST /editor/crewCommand/
	 */
	resource.create = function(req, res){
		if (req.body)
		{
			//make and save new crewCommand
			//relying on the model's validation and error reporting
			var crewCommand = req.body;
			CrewCommand.create(crewCommand, function(err, newCommand) {
				if (err) 
				{
					res.render('./editor/crewCommand/crewCommandForm', {
						title : "New Crew Command",
						formMethod : "POST",
						formAction : "/editor/crewCommand/",
						err : err});
				}
				else
				{
					//success!
					resource.index(req, res);
				}
			});
		}
		else
		{
			res.render('./editor/crewCommand/crewCommandForm', {
					title : "New Crew Command",
					formMethod : "POST",
					formAction : "/editor/crewcommand/"});
		}
	};
	
	/**
	 * show - GET /editor/crewcommand/:crewCommand
	 */
	resource.show = function(req, res){
		res.send(404, "Not supported");
	};
	
	/**
	 * edit - GET /editor/crewcommand/:crewCommand/edit
	 */
	resource.edit = function(req, res){
		if (req.params.crewcommand === undefined)
		{
			res.send(400, "Must include crewcommand.");
		}

		//find obj in db
		CrewCommand.findById(req.params.crewcommand, function(err, foundCommand) {
	   		if (err) 
	   		{
	   			res.send(404, "Either the id was not found or there was a problem with the database.");
	   		}
	   		else
	   		{
	   			//success!
				res.render('./editor/crewCommand/crewCommandForm', {
					title : "Edit Crew Command",
					formMethod : "PUT",
					formAction : "/editor/crewcommand/"+foundCommand.id,
					crewCommand : foundCommand,
				});
			}
		});
	};
	
	/**
	 * update - PUT /editor/crewcommand/:crewCommand
	 */
	resource.update = function(req, res){
		if (req.params.crewcommand === undefined)
		{
			res.send(400, "No id found.");
		}
		if (req.body)
		{	
			//find obj in db
			CrewCommand.findById(req.params.crewcommand, function(err, foundCommand) {
				if (err) 
				{
					res.send(404, "Either the id was not found or there was a problem with the database.");
				}
				else
				{
					//success!
					for (prop in req.body)
					{
						foundCommand[prop] = req.body[prop];
					}
					
					foundCommand.save(function(err) {
						if (err) {
							res.render('./editor/crewCommand/crewCommandForm', {
								title : "New Crew Command",
								formMethod : "POST",
								formAction : "/editor/crewcommand/",
								err : err
							});
						}
						else
						{
							//success!
							resource.index(req, res);
						}
					});			
				}
			});
		}
		else
		{
			res.render('./editor/crewCommand/crewCommandForm', {
				title : "New Crew Command",
				formMethod : "POST",
				formAction : "/editor/crewcommand/",
				err : "No body sent!"
			});
		}
			
	};
	
	/**
	 * destroy - DELETE /editor/crewcommand/:crewCommand
	 */
	resource.destroy = function(req, res){
		if (req.params.crewcommand === undefined)
		{
			res.send(400, "No id found.");
		}
		if (req.body)
		{	
			//find obj in db
			CrewCommand.findByIdAndRemove(req.params.crewcommand, function(err, foundCommand) {
				if (err) 
				{
					res.send(404, "Either the id was not found or there was a problem with the database.");
				}
				else
				{
					//success!
					resource.index(req, res);
				}
			});
		}
		else
		{
			res.render('./editor/crewCommand/crewCommandForm', {
				title : "New Crew Command",
				formMethod : "POST",
				formAction : "/editor/crewcommand/",
				err : "No body sent!"
			});
		}
	};
	
	return resource;
}