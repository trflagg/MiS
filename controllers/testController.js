
module.exports = function (app, service) {

	app.get('/test', function(req, res) {
		res.send({ 	test: true,
					method: "GET"
		}); 
	});
	
	app.post('/test', function(req, res) {
		if (req.body.data === undefined)
		{
			console.log(req.body);
			res.send(400, "POST object must contain item named 'data'");
		}
		else
		{
			res.send({ 	test: true,
					method: "POST",
					data: req.body.data,
			}); 
		}
	});
}