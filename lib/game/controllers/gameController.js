exports = module.exports;

exports.index = function(req, res) {
  var context = {};

  res.render('../lib/game/views/index.dot', context);
};