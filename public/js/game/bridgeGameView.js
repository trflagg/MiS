define([ 
    'game/gameView',
    'game/shipModel',
    'game/locationView',
    'game/infoView',
    'game/infoModel',
    'game/commandHolderView',
    'game/commandHolderViewTopLevel',
    'game/outputView',
    'game/outputModel'
], function(GameView, ShipModel, LocationView, InfoView, InfoModel, CommandHolderView, CommandHolderViewTopLevel, OutputView, OutputModel) {

    var bridgeGameView = GameView.extend({
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

            this.output = new OutputModel();
            this.outputView = new OutputView({
                model: this.output,
                el: $("#output")
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

    bridgeGameView.prototype.shipChanged = function() {
        var ship = this.ship;

        this.info.set({
            captain: ship.get("captain"),
            shipName: ship.get("shipName")
        });

        this.output.set("text", ship.get("output"));
    };

    return bridgeGameView;
});