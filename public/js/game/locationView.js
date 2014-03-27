define([ 
    'backbone',
    'doT!game/templates/locationView'
], function(Backbone, template) {

    var locationView = Backbone.View.extend({
        initialize: function() {
            this.template = template;

            this.render();
        },

        render: function() {
            $(this.el).html(this.template({
                name: this.model.name
            }));
            return this; 
        }
    });

    return locationView;
});