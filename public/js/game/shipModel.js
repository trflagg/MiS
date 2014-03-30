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
            , directMessages: new CommandHolderModel()
            , crew: new CommandHolderModel()
            , shipControls: new CommandHolderModel()
        }

        , initialize: function() {
            this.fetch();
        }

        , parse: function(response) {
            this.get("location").set(response.location);
            this.set("captain", response.captain);
            this.set("shipName", response.shipName);

            var commands = response.commands;
            for (var i=0, ll=commands.length; i<ll; i++) {
                var command = commands[i]

                switch (command.text) {

                    case 'crew':
                        this.get("crew").set(command);
                        break
                    case 'ship_controls':
                        this.get("shipControls").set(command);
                        break
                    case 'direct_messages':
                        this.get("directMessages").set(command);
                        break
                }
                // this wasn't getting triggered automatically, so do it manually
                // could also/instead trigger on ship (i.e. this.trigger('change')) if we wanted to
                // this.get("commands").trigger('change');
            }
        }
    });

   return shipModel;
});