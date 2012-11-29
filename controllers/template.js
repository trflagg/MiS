module.exports = function (app, service) {

	var DirectMessage = service.useModel('directMessage').DirectMessage;
	var resource = {}
	
	resource.index = function(req, res){
	  res.send('forum index');
	};
	
	resource.new = function(req, res){
	  res.send('new forum');
	};
	
	resource.create = function(req, res){
	  res.send('create forum');
	};
	
	resource.show = function(req, res){
	  res.send('show forum ' + req.params.forum);
	};
	
	resource.edit = function(req, res){
	  res.send('edit forum ' + req.params.forum);
	};
	
	resource.update = function(req, res){
	  res.send('update forum ' + req.params.forum);
	};
	
	resource.destroy = function(req, res){
	  res.send('destroy forum ' + req.params.forum);
	};
	
	return resource;
}