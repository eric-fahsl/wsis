/*global spa, Backbone*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'

], function ($, _, Backbone, JST) {
    'use strict';

    var ReccDetailModel = Backbone.Model.extend({

        urlRoot: 'http://whereshouldiski.com/lib/reccapi.php?resort=stevenspass&date=2014-10-14',

        initialize: function () {
            // this.fetch();
        },

        defaults: {
        },

        validate: function (attrs, options) {
        },

        parse: function (response, options) {
            return response._source;
        }
    });

    return ReccDetailModel;
});
