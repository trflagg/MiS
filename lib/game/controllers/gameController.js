module.exports = function(db) {
    require('../../../models/ship')(db);
    exports = {};

    exports.index = function(req, res) {

      var context = {};

      var ship = db.create('Ship');
      ship.setName('Picard');
      db.save('Ship', ship, function(err, newShip) {
          context.ship = ship;
          res.render('../lib/game/views/index.dot', context);
      });
    };

    exports.setName = function(req, res) {
         db.load('Ship', {'_id': db.ObjectId(req.body.id)}, function(err, ship) {
            if (err) return res.send(err);

            ship.setName(req.body.name);

            db.save('Ship', ship, function(err) {
                if (err) return res.send(err);

                res.send('');
            })

        })
    }
    return exports;
}
