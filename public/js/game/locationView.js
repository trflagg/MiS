define([ 
    'backbone',
    'doT!game/templates/locationView'
], function(Backbone, template) {

    var locationView = Backbone.View.extend({
        initialize: function() {
            this.template = template;

            if (this.model) {
                this.listenTo(this.model, 'change', this.render);
            }
        },

        render: function() {
            $(this.el).html(this.template({
                name: this.model.get("name"),
                description: this.model.get("description")
            }));
            return this; 
        }
    });

    return locationView;
});