define([
    'backbone'
    , 'game/commandView'
    , 'doT!game/templates/commandHolderView'
], function(Backbone, commandView, template) {

    var commandHolderView = Backbone.View.extend({

        initialize: function() {
            this.setTemplate();

            if (this.model) {
                this.listenTo(this.model, 'change', this.render);
            }
            this.render();
        },

        render: function() {
            if (this.model) {
                $(this.el).html(this.template({
                    text: this.model.get("text")
                    , childMessageCount: this.model.get("childMessageCount")
                    , cid: this.cid
                }));

                if (this.model.get("childMessageCount") === 0) {
                    $('p').addClass('disabled');
                }

                var children = this.model.get("children").models;
                _.each(children, this.renderChildren, {parent: this});
            }

            return this;
        }
    });

    commandHolderView.prototype.setTemplate = function() {
        this.template = template;
    };

    commandHolderView.prototype.renderChildren = function(child) {
        if (child.get("children")) {
            this.parent.renderChildCommandHolder(child);
        }
        else {
            this.parent.renderCommand(child);
        }
    };

    commandHolderView.prototype.renderChildCommandHolder = function(commandHolder) {
        this.$('#'+this.cid+'-children').append(
            new commandHolderView({
                tagName: 'li',
                model: commandHolder
            })
        .el);
    };

    commandHolderView.prototype.renderCommand = function(command) {
        this.$('#'+this.cid+'-children').append(
            new commandView({
                tagName: 'li',
                model: command
            })
        .el);
    };
    return commandHolderView;
});