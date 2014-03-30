define([ 
    'backbone',
    'doT!game/templates/infoView'
], function(Backbone, template) {

    var infoView = Backbone.View.extend({
        initialize: function() {
            this.template = template;

            if (this.model) {
                this.listenTo(this.model, 'change', this.render);
            }
        },

        render: function() {
            $(this.el).html(this.template({
                captain: this.model.get("captain"),
                shipName: this.model.get("shipName")
            }));
            return this; 
        }
    });

    return infoView;
});