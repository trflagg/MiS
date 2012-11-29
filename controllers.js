

var fs = require('fs');

module.exports = function(app, service, environment){
	
	require('./controllers/testController')(app, service);
	require('./controllers/directMessageController')(app, service);
	require('./controllers/editorController')(app, service);
	
	var directMessages = app.resource('editor/directmessage', require('./controllers/directMessageResource')(app, service));
	
	
	
	/* Old autoloading code from https://github.com/dtryon/clog/blob/master/src/controllers.js
    fs.readdir(__dirname + '/controllers', function(err, files){
        if (err) throw err;
        files.forEach(function(file){
            var name = file.replace('.js', '');
            require('./controllers/' + name)(app, service);
        });
    });
*/
};