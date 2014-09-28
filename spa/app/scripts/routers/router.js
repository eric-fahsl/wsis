/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/searchResultsView'

], function ($, _, Backbone, JST, SearchResults) {
    'use strict';

    var Workspace = Backbone.Router.extend({

        init: function () {
            this.searchResultsView = new SearchResults();
        },

        routes: {
            'search/:query': 'searchQuery',
            '': 'searchQuery',
            'search/': 'searchQuery'
        },

        searchQuery: function (param) {
            var facets = {};

            if (param) {
                param = param.trim();

                var params = param.split('&');

                for (var i in params) {
                    var values = params[i].split('=');
                    facets[values[0]] = values[1];
                }
            }
            if (!this.searchResultsView) {
                this.searchResultsView = new SearchResults();
            }
            this.searchResultsView.refreshData(facets);
        }
    });
    return Workspace;
});
