/*global require*/
'use strict';

require.config({
    baseUrl: './scripts',
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        handlebars: '../bower_components/handlebars/handlebars',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        handlebarsHelpers: 'vendor/handlebarsHelpers'
    },

    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery']
        },
        handlebars: {
            exports: 'Handlebars'
        },
        handlebarsHelpers: {
            deps: ['handlebars']
        }
    }
    
});

require([
    'backbone', 'routers/router', 'bootstrap', 'handlebarsHelpers'
], function (Backbone, Router, bootstrap, handlebarsHelpers) {
    // var searchResults = new SearchResultsView();
    var reccRouter = new Router();
    Backbone.history.start();
    $('#loadingImage').hide();
});
