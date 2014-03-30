define([
    'backbone'
], function(Backbone) {
   
    var commandModel = Backbone.Model.extend({
        defaults: {
            text: ''
        }
        , initialize: function() {
            this.set("id", this.get("text"));
        }
    });

   return commandModel;
});