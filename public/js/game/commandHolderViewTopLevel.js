define([
    'backbone'
    , 'game/commandHolderView'
    , 'doT!game/templates/commandHolderViewTopLevel']
, function(Backbone, CommandHolderView, template) {

    var commandHolderViewTopLevel = CommandHolderView.extend({

    });

    commandHolderViewTopLevel.prototype.setTemplate = function() {
        this.template = template;
    }
    
    return commandHolderViewTopLevel;
})