module.exports = function (app, service) {
	var DirectMessage = service.useModel('directMessage').DirectMessage;
	var resource = {};

	/**
	 * index - GET /editor/directmessage/
	 */
	resource.index = function(req, res){
		DirectMessage.find({}).select('subject id').exec(function(err, foundMessages, something) {
			if (err) 
			{ 
				res.send(500, "Error retrieving from database: "+err); 
			}
			res.render('./editor/directMessage/directMessageIndex', {'messages' : foundMessages} );
		});
	};

	/**
	 * new - GET /editor/directmessage/new
	 */	
	resource.new = function(req, res){
		res.render('./editor/directMessage/directMessageForm', {
					title : "New Direct Message",
					formMethod : "POST",
					formAction : "/editor/directmessage/"});
	};
	
	/**
	 * create - POST /editor/directmessage/
	 */
	resource.create = function(req, res){
		if (req.body)
		{
			//make and save new directMessage
			//relying on the model's validation and error reporting
			var directMessage = req.body;
			DirectMessage.create(directMessage, function(err, newMessage) {
				if (err) 
				{
					res.render('./editor/directMessage/directMessageForm', {
						title : "New Direct Message",
						formMethod : "POST",
						formAction : "/editor/directmessage/",
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
			res.render('./editor/directMessage/directMessageForm', {
					title : "New Direct Message",
					formMethod : "POST",
					formAction : "/editor/directmessage/"});
		}
	};
	
	/**
	 * show - GET /editor/directmessage/:directMessage
	 */
	resource.show = function(req, res){
		res.send(404, "Not supported");
	};
	
	/**
	 * edit - GET /editor/directmessage/:directMessage/edit
	 */
	resource.edit = function(req, res){
		if (req.params.directmessage === undefined)
		{
			res.send(400, "Must include directmessage.");
		}

		//find obj in db
		DirectMessage.findById(req.params.directmessage, function(err, foundMessage) {
	   		if (err) 
	   		{
	   			res.send(404, "Either the id was not found or there was a problem with the database.");
	   		}
	   		else
	   		{
	   			//success!
				res.render('./editor/directMessage/directMessageForm', {
					title : "Edit Direct Message",
					formMethod : "PUT",
					formAction : "/editor/directmessage/"+foundMessage.id,
					directMessage : foundMessage,
				});
			}
		});
	};
	
	/**
	 * update - PUT /editor/directmessage/:directMessage
	 */
	resource.update = function(req, res){
		if (req.params.directmessage === undefined)
		{
			res.send(400, "No id found.");
		}
		if (req.body)
		{	
			//find obj in db
			DirectMessage.findById(req.params.directmessage, function(err, foundMessage) {
				if (err) 
				{
					res.send(404, "Either the id was not found or there was a problem with the database.");
				}
				else
				{
					//success!
					for (prop in req.body)
					{
						foundMessage[prop] = req.body[prop];
					}
					
					foundMessage.save(function(err) {
						if (err) {
							res.render('./editor/directMessage/directMessageForm', {
								title : "New Direct Message",
								formMethod : "POST",
								formAction : "/editor/directmessage/",
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
			res.render('./editor/directMessage/directMessageForm', {
				title : "New Direct Message",
				formMethod : "POST",
				formAction : "/editor/directmessage/",
				err : "No body sent!"
			});
		}
			
	};
	
	/**
	 * destroy - DELETE /editor/directmessage/:directMessage
	 */
	resource.destroy = function(req, res){
		if (req.params.directmessage === undefined)
		{
			res.send(400, "No id found.");
		}
		if (req.body)
		{	
			//find obj in db
			DirectMessage.findByIdAndRemove(req.params.directmessage, function(err, foundMessage) {
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
			res.render('./editor/directMessage/directMessageForm', {
				title : "New Direct Message",
				formMethod : "POST",
				formAction : "/editor/directmessage/",
				err : "No body sent!"
			});
		}
	};
	
	return resource;
}