/*global require*/
'use strict';

require.config({
    baseUrl:'./scripts',
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/lodash/dist/lodash',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap'
    }
});

require([
    'backbone', 'views/myview'
], function (Backbone, MyView) {
    Backbone.history.start();
});
