/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'lib/wsisConstants'

], function ($, _, Backbone, JST, wsisConstants) {
    'use strict';

    var Facet = Backbone.Model.extend({

        // urlBase: '#search/',
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
                    var displayValue = wsisConstants.days[date.getUTCDay()] + ' ' + (date.getUTCMonth() + 1) + '/' +
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
            this.set({url: wsisConstants.convertFacetsToString(facets, this.facetType, this.attributes.term)});
        }

    });
    return Facet;
});