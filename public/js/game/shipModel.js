define([
    'backbone'
    , 'game/locationModel'
    , 'game/commandCollection'
], function(Backbone, LocationModel, CommandCollection) {
   
    var shipModel = Backbone.Model.extend({
        urlRoot: 'game/ship'

        , defaults: {
            location: new LocationModel()
            , captain: ''
            , shipName: ''
            , commands: new CommandCollection()
        }

        , initialize: function() {
            this.fetch();
        }

        , parse: function(response) {
            this.get("location").set(response.location);
            this.set("captain", response.captain);
            this.set("shipName", response.shipName);

            this.get("commands").set(response.commands);
            // this wasn't getting triggered automatically, so do it manually
            // could also/instead trigger on ship (i.e. this.trigger('change')) if we wanted to
            this.get("commands").trigger('change');
        }
    });

   return shipModel;
});