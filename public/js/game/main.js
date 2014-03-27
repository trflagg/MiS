requirejs.config({
    baseUrl: 'js/',
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone/backbone',
        doTCompiler:  '../bower_components/doT/doT',
        text:         '../bower_components/requirejs-text/text',
        doT:          '../bower_components/requirejs-dot/doT'
    },

    shim: {
        backbone: {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
    },

    // This tells optimizer don't bother including these 
    // (because they're already in requirejs-doT)
    stubModules: ['doTCompiler', 'text', 'doT']
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