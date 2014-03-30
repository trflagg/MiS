define([
    // need require to resolve circular reference w/ commandCollection
    'require'
    , 'backbone'
    , 'game/commandCollection'
    , 'game/commandModel'
], function(require, Backbone, CommandCollection, CommandModel) {
   
    var commandHolderModel = CommandModel.extend({
        defaults: {
            childMessageCount: 0
            , children: {}
        }

        , initialize: function(attrs, options) {
            // call superclass' initialize()
            CommandModel.prototype.initialize.apply(this, arguments);

            CommandCollection = require('game/commandCollection');
            if (attrs && attrs.children) {
                this.set("children", new CommandCollection(attrs.children));
            }
        }
    });

   return commandHolderModel;
});