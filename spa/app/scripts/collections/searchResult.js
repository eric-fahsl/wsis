/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/recc',
    'vendor/jquery.cookie',
    'lib/wsisConstants'

], function ($, _, Backbone, JST, Recc, jQueryCookie, wsisConstants) {
    'use strict';

    var SearchResult = Backbone.Collection.extend({

        // Reference to this collection's model. Only a placeholder for two sub-models
        model: Recc,
        // Store the search facets and results
        facets: {},
        results: {},

        url: wsisConstants.searchApiBase + 'fields=t',
        initialize: function () {
            if ($.cookie('coords')) {
                this.url += '&coords=' + $.cookie('coords');
            }
        },

        parse: function (response) {
            //console.log(response);
            this.facets = response.facets;
            this.results = response.results;
            //return response;
            return {};
        },

        clearAll: function () {
    //        _.each(this.models, function(model){ model.destroy(); });
            while (this.models.length) {
                this.models[0].destroy();
            }
        }

    });
    return SearchResult;
});
