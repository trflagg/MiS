define([ 
    'backbone',
    'doT!game/templates/commandView'
], function(Backbone, template) {

    var commandView = Backbone.View.extend({
        initialize: function() {
            this.template = template;

            if (this.model) {
                this.listenTo(this.model, 'change', this.render);
            }
            this.render();
        },

        render: function() {
            $(this.el).html(this.template({
                text: this.model.get("text")
            }));
            return this; 
        }
    });

    return commandView;
});