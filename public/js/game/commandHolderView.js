define([ 
    'backbone',
    'doT!game/templates/commandHolderView'
], function(Backbone, template) {

    var commandHolderView = Backbone.View.extend({

        initialize: function() {
            this.template = template;

            if (this.model) {
                this.listenTo(this.model, 'change', this.render);
            }
        },

        render: function() {
            $(this.el).html(this.template({
                text: this.model.get("text")
                , childMessageCount: this.model.get("childMessageCount")
            }));
            return this; 
        }
    });

    return commandHolderView;
});