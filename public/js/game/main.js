requirejs.config({
    baseUrl: 'js/',
    paths: {
        'jquery': '../bower_components/jquery/jquery',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'handlebars': '../bower_components/handlebars/handlebars'
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
        'handlebars': {
            exports: 'Handlebars'
        }
    }
});

requirejs([ 'jquery',
            'underscore',
            'backbone',
            'game/appView'
], function($, _, Backbone, appView) {
    $(function() {

        var app = new appView();
    });

});