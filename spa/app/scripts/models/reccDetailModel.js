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
        
        validate: function (attrs, options) {
        },

        parse: function (response, options) {
            var parsedResponse = response._source;
            if (parsedResponse.resortData && parsedResponse.resortData.domestic) {
                var domesticValue = parsedResponse.resortData.domestic;
                parsedResponse.resortData.isDomestic =
                    ((domesticValue === 'T' || domesticValue === 't') ? true : false);
            }
            //assign random value to assert change
            parsedResponse.random = Math.random();

            return parsedResponse;
        }
    });

    return ReccDetailModel;
});
