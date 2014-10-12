/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/searchResultsView',
    'views/aboutView',
    'views/feedbackView',
    'views/reccDetailsView'

], function ($, _, Backbone, JST, SearchResults, AboutView, FeedbackView, RecommendationView) {
    'use strict';

    var Workspace = Backbone.Router.extend({

        init: function () {
            this.searchResultsView = new SearchResults();
        },

        sections: {
            searchPage: '#searchContainer',
            nonSearchPage: '#nonSearchContainer'
        },

        routes: {
            'search/:query': 'searchQuery',
            '': 'searchQuery',
            'search': 'searchQuery',
            'search/': 'searchQuery',
            'about': 'aboutPage',
            'feedback': 'feedbackPage',
            'recommendations': 'recomendationsPage'
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
            this.showSearchPage();
            console.log('in searchQuery');
        },

        aboutPage: function () {
            var staticView = new AboutView({
                el: this.sections.nonSearchPage
            });
            this.hideSearchPage();
        },

        feedbackPage: function () {
            var staticView = new FeedbackView({
                el: this.sections.nonSearchPage
            });
            this.hideSearchPage();
        },

        recomendationsPage: function () {
            var reccView = new RecommendationView({
                el: this.sections.nonSearchPage
            });
            this.hideSearchPage();

        },

        showSearchPage: function () {
            $(this.sections.searchPage).show();
            $(this.sections.nonSearchPage).hide();
        },

        hideSearchPage: function () {
            $(this.sections.searchPage).hide();
            $(this.sections.nonSearchPage).show();
        }
    });
    return Workspace;
});
