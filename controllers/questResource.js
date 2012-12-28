module.exports = function (app, service) {
	var Quest = service.useModel('quest').Quest;
	var middleware = require('./middleware');
	var resource = {};

	/**
	 * index - GET /editor/quest/
	 */
	resource.index = function(req, res){
		Quest.find({}).select('name id').exec(function(err, foundQuests, something) {
			if (err) 
			{ 
				res.send(500, "Error retrieving from database: "+err); 
			}
			res.render('./editor/quest/questIndex', {'quests' : foundQuests} );
		});
	};

	/**
	 * new - GET /editor/quest/new
	 */	
	resource.new = function(req, res){
		res.render('./editor/quest/questForm', {
					title : "New Quest",
					formMethod : "POST",
					formAction : "/editor/quest/"});
	};
	
	/**
	 * create - POST /editor/quest/
	 */
	resource.create = function(req, res){
		if (req.body)
		{
			//make and save new quest
			//relying on the model's validation and error reporting
			var quest = req.body;
			Quest.create(quest, function(err, newQuest) {
				if (err) 
				{
					res.render('./editor/quest/questForm', {
						title : "New Quest",
						formMethod : "POST",
						formAction : "/editor/quest/",
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
			res.render('./editor/quest/questForm', {
					title : "New Quest",
					formMethod : "POST",
					formAction : "/editor/quest/"});
		}
	};
	
	/**
	 * show - GET /editor/quest/:quest
	 */
	resource.show = function(req, res){
		res.send(404, "Not supported");
	};
	
	/**
	 * edit - GET /editor/quest/:quest/edit
	 */
	resource.edit = function(req, res){
		if (req.params.quest === undefined)
		{
			res.send(400, "Must include quest.");
		}

		//find obj in db
		Quest.findById(req.params.quest, function(err, foundQuest) {
	   		if (err) 
	   		{
	   			res.send(404, "Either the id was not found or there was a problem with the database.");
	   		}
	   		else
	   		{
	   			//success!
				console.log(foundQuest);
				res.render('./editor/quest/questForm', {
					title : "Edit Quest",
					formMethod : "PUT",
					formAction : "/editor/quest/"+foundQuest.id,
					quest : foundQuest,
				});
			}
		});
	};
	
	/**
	 * update - PUT /editor/quest/:quest
	 */
	resource.update = function(req, res){
		if (req.params.quest === undefined)
		{
			res.send(400, "No id found.");
		}
		if (req.body)
		{	
			//find obj in db
			Quest.findById(req.params.quest, function(err, foundQuest) {
				if (err) 
				{
					res.send(404, "Either the id was not found or there was a problem with the database.");
				}
				else
				{
					//success!
					for (prop in req.body)
					{
						foundQuest[prop] = req.body[prop];
					}
					
					foundQuest.save(function(err) {
						if (err) {
							res.render('./editor/quest/questForm', {
								title : "New Quest",
								formMethod : "POST",
								formAction : "/editor/quest/",
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
			res.render('./editor/quest/questForm', {
				title : "New Quest",
				formMethod : "POST",
				formAction : "/editor/quest/",
				err : "No body sent!"
			});
		}
			
	};
	
	/**
	 * destroy - DELETE /editor/quest/:quest
	 */
	resource.destroy = function(req, res){
		if (req.params.quest === undefined)
		{
			res.send(400, "No id found.");
		}
		if (req.body)
		{	
			//find obj in db
			Quest.findByIdAndRemove(req.params.quest, function(err, foundQuest) {
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
			res.render('./editor/quest/questForm', {
				title : "New Quest",
				formMethod : "POST",
				formAction : "/editor/quest/",
				err : "No body sent!"
			});
		}
	};
	
	return resource;
}