//shamelessly copied from https://github.com/dtryon/clog/blob/master/src/controllers.js

var fs = require('fs');

module.exports = function(app, service, environment){
    fs.readdir(__dirname + '/controllers', function(err, files){
        if (err) throw err;
        files.forEach(function(file){
            var name = file.replace('.js', '');
            require('./controllers/' + name)(app, service);
        });
    });
};