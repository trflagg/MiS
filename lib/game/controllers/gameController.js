module.exports = function(db) {
    require('../../../models/ship')(db);
    require('argie/models/message')(db);
    exports = {};

    exports.index = function(req, res) {

      var context = {};
      var firstMessage = 'INIT';

      var ship = db.create('Ship');
      ship.setName('Picard');
      ship.setShipName('Laviathan');
      ship.setLocation({ 
        name: "Cygni - Andromedae Military Interchange",
        description: "An empty void of space in the Cygni-Arthurian border region where the two nation's warp networks meet."
      });

      ship.addMessage('START', firstMessage);
      ship.runMessage('START', function(err, result) {
        if (err) {
          console.log(err);
          res.send(500, { error: err });
        }
        
        ship.appendOutput(result);

        db.save('Ship', ship, function(err, newShip) {
            context.ship = ship;
            res.render('../lib/game/views/index.dot', context);
        });
      });
    };

    exports.getShip = function(req, res) {
      var id = req.param('id');
      db.load('Ship', {'_id': db.ObjectId(id)}, function(err, ship) {
        if (err) return res.send({err: err});

        var ship_client = {};
        ship_client.captain = ship.getName();
        ship_client.shipName = ship.getShipName();
        ship_client.output = ship.getOutput();
        var location = ship.getLocation();
        ship_client.location = {
          name: location.name
          , description: location.description
        };
        ship_client.commands = ship.getCommandTextList();
        return res.send(ship_client);

      });
    };

    return exports;
}
