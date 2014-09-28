/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'

], function ($, _, Backbone, JST) {
    'use strict';

    var Facet = Backbone.Model.extend({

        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        urlBase: '#search/',
        facetType: '',

        initialize: function (attributes, options) {
    //        if (attributes) {
    //            console.log('a: ' + attributes);
    //        }
            var facets = {};
            if (options) {
                facets = options.collection.facets;
                this.facetType = options.collection.facetType;
            }
            var termValue = '';
            if (this.attributes.term) {
                termValue = this.attributes.term;
                this.set({displayValue: termValue});
                if (termValue.substring(0, 3) === '201') {
                    var date = new Date(termValue.split('-').join('/'));
                    var displayValue = this.days[date.getUTCDay()] + ' ' + (date.getUTCMonth() + 1) + '/' +
                        date.getUTCDate() + '/' + date.getUTCFullYear().toString().substring(2);
                    this.set({displayValue: displayValue });
                }
            }

            //For Distance Facets
            if (this.facetType === 'distance') {
                var distance = this.attributes.to;
                this.set({term: distance});
                this.set({displayValue: 'Under ' + distance + ' Miles'});
            } else if (this.facetType === 'powder') {
                var rating = this.attributes.from;
                this.set({term: rating});
    //            <div class='flakes' style='width: 120px' title='Rating: 4 / 5'></div>
                this.set({displayValue: 'At least <div class="flakes" style="width: ' + (30 * rating) + 'px;"></div>'});
            }

            //Set the destination URL
            this.set({url: this.convertFacetsToString(facets, this.facetType, this.attributes.term)});
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
    return Facet;
});