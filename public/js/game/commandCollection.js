define([
    'require',
    'backbone',
    'game/commandModel',
    'game/commandHolderModel'
], function(require, Backbone, CommandModel, CommandHolderModel) {

    var commandCollection = Backbone.Collection.extend({

        model: function(attrs, options) {
            if (attrs.children) {
                // handle circular reference
                var CommandHolderModel = require('game/commandHolderModel');
                return new CommandHolderModel(attrs, options);
            }
            else {
                return new CommandModel(atts, options);
            }
        }
    });

   return commandCollection;
});