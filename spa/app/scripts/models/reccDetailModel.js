/*global spa, Backbone*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'

], function ($, _, Backbone, JST) {
    'use strict';

    var ReccDetailModel = Backbone.Model.extend({

        // urlRoot: 'http://whereshouldiski.com/lib/reccapi.php?resort=stevenspass&date=2014-10-20',

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

        parse: function (response, options) {
            return response._source;
        }
    });

    return ReccDetailModel;
});
