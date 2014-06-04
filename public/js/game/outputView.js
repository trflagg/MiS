define([ 
    'backbone',
    // 'doT!game/templates/outputView'
], function(Backbone, template) {

    var outputView = Backbone.View.extend({
        initialize: function() {
            this.template = template;

            if (this.model) {
                this.listenTo(this.model, 'change', this.render);
            }
        },

        render: function() {
            $(this.el).text( this.model.get("text") );
            return this; 
        }
    });

    return outputView;
});