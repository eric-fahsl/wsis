/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'lib/wsisConstants'

], function ($, _, Backbone, JST, wsisConstants) {
    'use strict';

    var DateModel = Backbone.Model.extend({
        urlBase: '#search/',
        
        initialize: function (attributes, options) {
            var facets = {};
            if (options) {
                facets = options;
            }

            var date = new Date(this.get('date').split('-').join('/'));

            var prettyDate = wsisConstants.days[date.getUTCDay()] + ', ' + wsisConstants.months[date.getUTCMonth()] + ' ' + date.getUTCDate();
            this.set({prettyDate: prettyDate});

            //Set the destination URL
            this.set({url: this.convertFacetsToString(facets, 'date', this.get('date'))});
        },

        convertFacetsToString: function (facets, key, value) {
            var url = this.urlBase;
            var showFacet = true;
            for (var k in facets) {
                if (facets[k] !== value)
                    url += k + '=' + facets[k] + '&';
                else
                    showFacet = false;
            }
            if (showFacet)
                url += key + '=' + value;
            if (url[url.length - 1] === '&')
                url = url.substr(0, url.length - 1);
            return url;
        }

    });
    return DateModel;
});