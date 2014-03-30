define([
    'backbone',
    'game/commandModel',
    'game/commandHolderModel'
], function(Backbone, CommandModel, CommandHolderModel) {
   
    var commandCollection = Backbone.Collection.extend({

        model: function(attrs, options) {
            if (attrs.children) {
                return new CommandHolderModel(attrs, options);
            }
            else {
                return new CommandModel(atts, options);
            }
        }
    });

   return commandCollection;
});