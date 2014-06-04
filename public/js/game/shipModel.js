define([
    'backbone'
    , 'game/locationModel'
    , 'game/commandHolderModel'
], function(Backbone, LocationModel, CommandHolderModel) {

    var shipModel = Backbone.Model.extend({
        urlRoot: 'game/ship'

        , defaults: {
            location: new LocationModel()
            , captain: ''
            , shipName: ''
            , output: ''
            , directMessages: new CommandHolderModel({
                text: 'direct messages'
            })
            , crew: new CommandHolderModel({
                text: 'crew'
            })
            , shipControls: new CommandHolderModel({
                text: 'ship controls'
            })
        }

        , initialize: function() {
            this.fetch();
        }

        , parse: function(response) {
            this.get("location").set(response.location);
            this.set("captain", response.captain);
            this.set("shipName", response.shipName);
            this.set("output", response.output);

            var commands = response.commands;
            for (var i=0, ll=commands.length; i<ll; i++) {
                var command = commands[i]

                switch (command.text) {

                    case 'crew':
                        this.get("crew").set("childMessageCount", command.childMessageCount);
                        this.get("crew").setChildren(command.children);
                        break
                    case 'ship_controls':
                        this.get("shipControls").setChildren(command.children);
                        break
                    case 'direct_messages':
                        this.get("directMessages").setChildren(command.children);
                        break
                }
            }
        }
    });

   return shipModel;
});