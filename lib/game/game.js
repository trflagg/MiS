// Third-party libraries
var express = require('express')
  , app = exports = module.exports = express();

exports.gameController    = require('./controllers/gameController');


// actually /game because module is attached under /game
app.get('/', exports.gameController.index);
