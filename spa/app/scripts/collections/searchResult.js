/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/recc',
    'vendor/jquery.cookie'

], function ($, _, Backbone, JST, Recc) {
    'use strict';

    var SearchResult = Backbone.Collection.extend({

        // Reference to this collection's model. Only a placeholder for two sub-models
        model: Recc,
        // Store the search facets and results
        facets: {},
        results: {},

        url: 'http://whereshouldiski.com/lib/reccapi.php?fields=t',
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
