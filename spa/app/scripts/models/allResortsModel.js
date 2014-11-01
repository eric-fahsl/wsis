/*global spa, Backbone*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'

], function ($, _, Backbone, JST) {
    'use strict';

    var allResortsModel = Backbone.Model.extend({

        // urlRoot: 'scripts/server/resorts.json',

        initialize: function () {
        },

        defaults: {
        },

        retrieve: function () {
            console.log(this.urlRoot);
            this.fetch();
        },
        
        validate: function (attrs, options) {
        },

    });

    return allResortsModel;
});
