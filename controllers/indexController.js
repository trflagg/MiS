module.exports = function (app, service) {
	/**
	 * GET /
	 */
	app.get('/', index);
	function index(req, res) {
		res.render('./index.html');
	}
	
	
	app.get('/TaC', function (req, res) {
		res.render('./TaC.html');
	});
}