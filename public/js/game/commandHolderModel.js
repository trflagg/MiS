define([
    // need require to resolve circular reference w/ commandCollection
    'require'
    , 'underscore'
    , 'backbone'
    , 'game/commandCollection'
    , 'game/commandModel'
], function(require, _, Backbone, CommandCollection, CommandModel) {

    var commandHolderModel = CommandModel.extend({
        defaults: {
            childMessageCount: 0
            , children: {}
        }

        , initialize: function(attrs, options) {
            // call superclass' initialize()
            CommandModel.prototype.initialize.apply(this, arguments);

            // handle circular reference
            var CommandCollection = require('game/commandCollection');
            if (attrs && attrs.children) {
                this.set("children", new CommandCollection(attrs.children));
            }
            else {
                this.set("children", new CommandCollection());
            }
        }
    });

    commandHolderModel.prototype.setChildren = function(children) {
        this.get("children").reset(children);
        this.trigger('change');
    }

    commandHolderModel.prototype.getChildren = function() {
        return _.map(this.get("children").models, function(child) {
            return child.get("id");
        });
    };

   return commandHolderModel;
});