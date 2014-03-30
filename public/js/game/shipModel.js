define([
    'backbone',
    'game/locationModel'
], function(Backbone, LocationModel) {
   
    var shipModel = Backbone.Model.extend({
        urlRoot: 'game/ship'

        , defaults: {
            location: new LocationModel()
            , captain: ''
            , shipName: ''
        }

        , initialize: function() {
            this.fetch();
        }

        , parse: function(response) {
            this.get("location").set(response.location);
            this.set("captain", response.captain);
            this.set("shipName", response.shipName);
        }
    });

   return shipModel;
});