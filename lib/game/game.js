module.exports = function(db) {
    // Third-party libraries
    var express = require('express')
      , app = exports = express();

    var doT = require('express-dot');
    doT.setGlobals({
        lib: 'game'
    });

    exports.gameController    = require('./controllers/gameController')(db);

    app.use('/game', function() {
        app.set('lib', 'game');
    })
    // actually /game because module is attached under /game
    app.get('/', exports.gameController.index);
    app.get('/pageUI/:id', exports.gameController.getPageUI);

    return exports;
}
