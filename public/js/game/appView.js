define([ 
    'backbone',
    'game/titleGameView'
], function(Backbone, TitleGameView) {

    var appView = Backbone.View.extend({
        initialize: function() {
            this.currentView = new TitleGameView({
                el: $("#main")
            });
            this.render();
        },

        render: function() {
            this.currentView.fadeTitle();
        }
    });

    return appView;
});