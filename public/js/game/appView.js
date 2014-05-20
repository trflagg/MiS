define([ 
    'backbone',
    'game/shipModel',
    'game/locationView',
    'game/infoView',
    'game/infoModel',
    'game/commandHolderView',
    'game/commandHolderViewTopLevel'
], function(Backbone, ShipModel, LocationView, InfoView, InfoModel, CommandHolderView, CommandHolderViewTopLevel) {

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

            this.crewView = new CommandHolderViewTopLevel({
                model: this.ship.get("crew"),
                el: $("#crew")
            });

            this.shipControlsView = new CommandHolderViewTopLevel({
                model: this.ship.get("shipControls"),
                el: $("#shipControls")
            });

            this.directMessagesView = new CommandHolderView({
                model: this.ship.get("directMessages"),
                el: $("#directMessages")
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