/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/facet'

], function ($, _, Backbone, JST, Facet) {
    'use strict';
    
    var sortOption = Facet.extend({
        urlBase: '#search/',
        initialize: function (attributes, options) {

            attributes.selected = false;
            var facets = {};
            if (options) {
                facets = options;
                if (facets.sort && facets.sort === attributes.sort)
                    attributes.selected = true;
            }
            this.attributes = attributes;

            //Set the destination URL
            this.set({url: this.convertFacetsToString(facets, 'sort', this.attributes.sort)});
        },

        convertFacetsToString: function (facets, key, value) {
            var url = this.urlBase;
            var showFacet = true;
            for (var k in facets) {
                if (k === key) {} //keep the facet, but do not use existing value
                else if (facets[k] !== value)
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
    return sortOption;
});