define([ 
    'game/gameView',
    'doT!game/templates/titleGameView'
], function(GameView, template) {

    var titleView = GameView.extend({
        initialize: function() {
            this.template = template;
        },

        render: function() {
            $(this.el).html(this.template());
            return this; 
        }

    });

    titleView.prototype.fadeTitle = function() {
        this.$el.hide();
        this.render();
        this.$el.fadeIn({
            duration: 2000,
            easing: 'linear'
        }).delay(2000).fadeOut({
            duration: 2000,
            easing: 'linear'
        });
    };
    return titleView;
});