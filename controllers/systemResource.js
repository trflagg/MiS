module.exports = function (app, service) {
	var System = service.useModel('system').System;
	var resource = {};

	/**
	 * index - GET /editor/system/
	 */
	resource.index = function(req, res){
		System.find({}).select('name id').exec(function(err, foundObj, something) {
			if (err) 
			{ 
				res.send(500, "Error retrieving from database: "+err); 
			}
			res.render('./editor/system/systemIndex', {'systems' : foundObj} );
		});
	};

	/**
	 * new - GET /editor/system/new
	 */	
	resource.new = function(req, res){
		res.render('./editor/system/systemForm', {
					title : "New System",
					formMethod : "POST",
					formAction : "/editor/system/",
				});
	};
	
	/**
	 * create - POST /editor/system/
	 */
	resource.create = function(req, res){
		if (req.body)
		{
			//make and save new directMessage
			//relying on the model's validation and error reporting
			var system = req.body;
			System.create(system, function(err, newObj) {
				if (err) 
				{
					res.render('./editor/system/systemForm', {
						title : "New System",
						formMethod : "POST",
						formAction : "/editor/system/",
						err : err,
					});
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
			res.render('./editor/system/systemForm', {
					title : "New System",
					formMethod : "POST",
					formAction : "/editor/system/",
				});
		}
	};
	
	/**
	 * show - GET /editor/system/:system
	 */
	resource.show = function(req, res){
		res.send(404, "Not supported");
	};
	
	/**
	 * edit - GET /editor/system/:system/edit
	 */
	resource.edit = function(req, res){
		if (req.params.system === undefined)
		{
			res.send(400, "Must include system.");
		}

		//find obj in db
		System.findById(req.params.system, function(err, foundObj) {
	   		if (err) 
	   		{
	   			res.send(404, "Either the id was not found or there was a problem with the database.");
	   		}
	   		else
	   		{
	   			//success!
				res.render('./editor/system/systemForm', {
					title : "Edit System",
					formMethod : "PUT",
					formAction : "/editor/system/"+foundObj.id,
					system : foundObj,
				});
			}
		});
	};
	
	/**
	 * update - PUT /editor/system/:system
	 */
	resource.update = function(req, res){
		if (req.params.system === undefined)
		{
			res.send(400, "No id found.");
		}
		if (req.body)
		{	
			//find obj in db
			System.findById(req.params.system, function(err, foundObj) {
				if (err) 
				{
					res.send(404, "Either the id was not found or there was a problem with the database.");
				}
				else
				{
					//success!
					for (prop in req.body)
					{
						foundObj[prop] = req.body[prop];
					}
					
					foundObj.save(function(err) {
						if (err) {
							res.render('./editor/system/systemForm', {
								title : "New System",
								formMethod : "POST",
								formAction : "/editor/system/",
								err : err,
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
			res.render('./editor/system/systemForm', {
				title : "New System",
				formMethod : "POST",
				formAction : "/editor/system/",
				err : "No body sent!",
			});
		}
			
	};
	
	/**
	 * destroy - DELETE /editor/system/:system
	 */
	resource.destroy = function(req, res){
		if (req.params.system === undefined)
		{
			res.send(400, "No id found.");
		}
		if (req.body)
		{	
			//find obj in db
			System.findByIdAndRemove(req.params.system, function(err, foundMessage) {
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
			res.render('./editor/system/systemForm', {
				title : "New System",
				formMethod : "POST",
				formAction : "/editor/system/",
				err : "No body sent!",
			});
		}
	};
	
	return resource;
}