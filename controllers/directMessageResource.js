module.exports = function (app, service) {
	var DirectMessage = service.useModel('directMessage').DirectMessage;
	var resource = {};

	resource.index = function(req, res){
		DirectMessage.find({}).select('subject id').exec(function(err, foundMessages, something) {
			if (err) { console.log(err); }
			console.log(foundMessages);
			res.render('directMessageIndex', {'messages' : foundMessages} );
		});
	};
	
	resource.new = function(req, res){
		res.render('directMessageForm', {
					title : "New Direct Message",
					formMethod : "POST",
					formAction : "/editor/directmessage/"});
	};
	
	resource.create = function(req, res){
		if (req.body)
		{
			//make and save new directMessage
			//relying on the model's validation and error reporting
			var directMessage = req.body;
			DirectMessage.create(directMessage, function(err, newMessage) {
				if (err) 
				{
					res.render('directMessageForm', {
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
			res.render('directMessageForm', {
					title : "New Direct Message",
					formMethod : "POST",
					formAction : "/editor/directmessage/"});
		}
	};
	
	resource.show = function(req, res){
		res.render('directMessageNew', {});
	};
	
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
				res.render('directMessageForm', {
					title : "Edit Direct Message",
					formMethod : "PUT",
					formAction : "/editor/directmessage/"+foundMessage.id,
					directMessage : foundMessage,
				});
			}
		});
	};
	
	resource.update = function(req, res){
		res.send('update coming soon.');
	};
	
	resource.destroy = function(req, res){
		res.send('destroy forum ' + req.params.forum);
	};
	
	return resource;
}