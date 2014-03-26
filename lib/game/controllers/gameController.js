module.exports = function(db) {
    require('../../../models/ship')(db);
    exports = {};

    exports.index = function(req, res) {

      var context = {};

      var ship = db.create('Ship');
      ship.setName('Picard');
      ship.setLocation("Cygni - Andromedae Military Interchange");
      db.save('Ship', ship, function(err, newShip) {
          context.ship = ship;
          res.render('../lib/game/views/index.dot', context);
      });
    };

    exports.getPageUI = function(req, res) {
      var id = req.param('id');
      db.load('Ship', {'_id': db.ObjectId(id)}, function(err, ship) {
        if (err) return res.send(err);

        var pageUI = {};

        pageUI.location = {
          name: ship.getLocation()
        };
        pageUI.commands = ship.getCommandTextList();

        return res.send(pageUI);

      })
    }
    return exports;
}
