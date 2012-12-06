module.exports = function (app, service) {

	

	/**
	 * GET /editor/
	 */
	
	app.get('/editor/', function(req, res) {
		res.render('./editor/editorLayout');
	});
}