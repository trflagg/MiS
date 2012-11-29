module.exports = function (app, service) {

	var DirectMessage = service.useModel('directMessage').DirectMessage;
	
	/**
	 * POST /game/directmessage/
	 * creates new direct message and returns the id.
	 */
	app.post('/game/directmessage/', function(req, res) {
		//get obj
		if (req.body.directMessage === undefined)
		{
			res.send(400, "POST object must contain item named 'directMessage'");
		}
		else
		{
			//make and save new directMessage
			//relying on the model's validation and error reporting
			DirectMessage.create(req.body.directMessage, function(err, newMessage) {
				if (err) 
				{
					res.send('400', err);
				}
				else
				{
					//success!
					//send back id.
					res.send({
						id : newMessage.id,
					});
				}
			});
				
		}
	});
	
	
		
	/**
	 * GET /game/directmessage/:id
	 * Returns directMessage object if one found.
	 */
	app.get('/game/directmessage/:id', function(req, res) {
		if (req.params.id === {})
		{
			res.send(400, "Must include id.");
		}
			
		//find obj in db
		DirectMessage.findById(req.params.id, function(err, foundMessage) {
	   		if (err) 
	   		{
	   			res.send(500, err);
	   		}
	   		else
	   		{
	   			//success!
	   			//send back id.
				res.set('Content-Type', 'application/json');
				if (foundMessage === null)
				{
					res.send(404, "No message with id "+req.params.id+" found.");
				}
				else
				{
	   				res.send(foundMessage);
				}
	   		}
		}); 
	});
	
		
	/**
	 * DELETE /game/directmessage/:id
	 * Removes the directMessage object.
	 */
	app.delete('/game/directmessage/:id', function(req, res) {
		if (req.params.id === {})
		{
			res.send(400, "Must include id.");
		}
			
		//find obj in db
		DirectMessage.findByIdAndRemove(req.params.id, function(err, foundMessage) {
	   		if (err) 
	   		{
	   			res.send(500, err);
	   		}
	   		else
	   		{
	   			//success!
				if (foundMessage === null)
				{
					res.send(404, "No message with id "+req.params.id+" found.");
				}
				else
				{
	   				res.send(200);
				}
	   		}
		}); 
	});
	
	
}