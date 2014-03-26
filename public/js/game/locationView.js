define([ 
    'backbone',
    'handlebars'
], function(Backbone) {

    var locationView = Backbone.View.extend({
        initialize: function() {
            this.template = Handlebars.compile($('#locationView-template').html());

            this.render();
        },

        render: function() {
            $(this.el).html(this.template({
                name: 'this.model.name'
            }));
            return this; 
        }
    });

    return locationView;
});