module.exports = function(app, service, environment){
	
	//based on code from https://github.com/dtryon/clog/blob/master/src/controllers.js
	require('./controllers/startController')(app, service);
	require('./controllers/gameController')(app, service);
	
	//require('./controllers/directMessageController')(app, service);
	//require('./controllers/editorController')(app, service);
	//require('./controllers/gameController')(app, service);
	
	
	//var directMessages = app.resource('editor/directmessage', require('./controllers/directMessageResource')(app, service));
	//var crewcommand = app.resource('editor/crewcommand', require('./controllers/crewcommandResource')(app, service));
	//var questResource = app.resource('editor/quest', require('./controllers/questResource')(app, service));
	//var systems = app.resource('editor/system', require('./controllers/systemResource')(app, service));

};