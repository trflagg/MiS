// Third-party libraries
var express = require('express')
  , app = exports = module.exports = express();

var doT = require('express-dot');
doT.setGlobals({
    lib: 'game'
});

exports.gameController    = require('./controllers/gameController');

app.use('/game', function() {
    app.set('lib', 'game');
})
// actually /game because module is attached under /game
app.get('/', exports.gameController.index);
