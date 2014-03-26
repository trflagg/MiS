requirejs.config({
    baseUrl: 'js/',
    paths: {
        'jquery': '../bower_components/jquery/jquery',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone'
    },

    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
    }
});

requirejs([ 'jquery',
            'underscore',
            'backbone'
], function($, _, Backbone) {
    
    $(function() {
        $("#submit-button").click(function() {
            var name = $("#name-input").val()
                , id = $("#id-hidden").val()
            $.post('/game/name',
                {
                    name: name,
                    id: id
                }
            );
        });
    });

});