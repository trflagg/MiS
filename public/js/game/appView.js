define([ 
    'backbone',
    'game/locationView',
    'game/pageUIModel'
], function(Backbone, locationView, pageUIModel) {

    var appView = Backbone.View.extend({
        initialize: function() {

            this.model = new pageUIModel({
                id: $("#ship-data").data('id')
            });
            this.locationView = new locationView({
                el: $("#main")
                , model: {
                    name: 'Andromedae'
                }
            });   
        }
    });

    return appView;
});