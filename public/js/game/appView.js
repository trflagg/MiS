define([ 
    'backbone',
    'game/locationView',
    'game/locationModel',
    'game/shipModel'
], function(Backbone, locationView, locationModel, shipModel) {

    var appView = Backbone.View.extend({
        initialize: function() {

            this.ship = new shipModel({
                id: $("#ship-data").data('id')
            });
            this.listenTo(this.ship, 'change', this.shipChanged);
            this.location = new locationModel();
            this.locationView = new locationView({
                model: this.location,
                el: $("#main")
            })
        },
    });

    appView.prototype.shipChanged = function() {
        this.location.set(this.ship.get("location"));
    };

    return appView;
});