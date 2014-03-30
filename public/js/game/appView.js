define([ 
    'backbone',
    'game/shipModel',
    'game/locationView',
    'game/infoView',
    'game/infoModel',
], function(Backbone, ShipModel, LocationView, InfoView, InfoModel) {

    var appView = Backbone.View.extend({
        initialize: function() {
            this.ship = new ShipModel({
                id: $("#ship-data").data('id')
            });
            this.listenTo(this.ship, 'change', this.shipChanged);
            this.listenTo(this.ship.get("commands"), 'change', this.commandsChanged);

            this.locationView = new LocationView({
                model: this.ship.get("location"),
                el: $("#location")
            });

            this.info = new InfoModel();
            this.infoView = new InfoView({
                model: this.info,
                el: $("#info")
            });
        },
    });

    appView.prototype.shipChanged = function() {
        var ship = this.ship;

        this.info.set({
            captain: ship.get("captain"),
            shipName: ship.get("shipName")
        });

    };

    appView.prototype.commandsChanged = function() {
        var commands = this.ship.get("commands");
        console.dir(commands);
    };

    return appView;
});