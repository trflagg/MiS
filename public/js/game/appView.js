define([ 
    'backbone',
    'game/shipModel',
    'game/locationView',
    'game/locationModel',
    'game/infoView',
    'game/infoModel'
], function(Backbone, ShipModel, LocationView, LocationModel, InfoView, InfoModel) {

    var appView = Backbone.View.extend({
        initialize: function() {
            this.ship = new ShipModel({
                id: $("#ship-data").data('id')
            });
            this.listenTo(this.ship, 'change', this.shipChanged);

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

    return appView;
});