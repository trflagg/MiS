module.exports = function(db) {
    // Third-party libraries
    var express = require('express')
      , app = exports = express();

    exports.gameController    = require('./controllers/gameController')(db);

    app.use('/game', function() {
        app.set('lib', 'game');
    })
    // actually /game because module is attached under /game
    app.get('/', exports.gameController.index);
    app.get('/ship/:id', exports.gameController.getShip);

    return exports;
}
