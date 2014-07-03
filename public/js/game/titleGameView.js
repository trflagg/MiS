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
            $("#titleGameView__title").hide();
            $("#titleGameView__text").hide();
            return this; 
        }

    });

    titleView.prototype.fadeTitle = function() {
        this.render();
        var title = $("#titleGameView__title");
        var thisView = this;

        title.fadeIn({
            duration: 2000,
            easing: 'linear'
        }).delay(2000).fadeOut({
            duration: 2000,
            easing: 'linear',
            complete: function() {
                thisView.typeText("Prologue");
            }
        });
    };

    titleView.prototype.fadeText = function(text) {
        var text_el = $("#titleGameView__text");
        text_el.text(text);

        text_el.fadeIn({
            duration: 2000,
            easing: 'linear'
        }).delay(2000).fadeOut({
            duration: 2000,
            easing: 'linear'
        });
    };

    titleView.prototype.typeText = function(text) {
        $("#titleGameView__text").show();
        showText("#titleGameView__text", text, 0, 50);
    };

    var showText = function (target, message, index, interval) {
        if (index < message.length) { 
            $(target).append(message[index++]); 
            setTimeout(function () { showText(target, message, index, interval); }, interval); 
        } 
    }
    
    return titleView;
});