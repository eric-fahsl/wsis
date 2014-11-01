/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/searchResultsView',
    'views/aboutView',
    'views/feedbackView',
    'views/reccDetailsView',
    'views/resortListingView',
    'lib/wsisConstants'
], function ($, _, Backbone, JST, SearchResults, AboutView, FeedbackView, RecommendationView, ResortListingView, wsisConstants) {
    'use strict';

    var Workspace = Backbone.Router.extend({

        reccDetailsView: new RecommendationView(),

        init: function () {
            // this.searchResultsView = new SearchResults();
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
            'resorts': 'resortListingPage',
            'resort/:name/:date': 'recomendationsPage',
            'resort/:name': 'recomendationsPage'
        },

        searchQuery: function (param) {
            console.log('router: searchQuery');
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
            this.selectMenuItem('recommendations');
        },

        aboutPage: function () {
            console.log('router: aboutPage');
            var staticView = new AboutView({
                el: this.sections.nonSearchPage
            });
            this.hideSearchPage();
            this.selectMenuItem('about');
        },

        feedbackPage: function () {
            console.log('router: feedbackPage');
            var staticView = new FeedbackView({
                el: this.sections.nonSearchPage
            });
            this.hideSearchPage();
            this.selectMenuItem('feedback');
        },

        recomendationsPage: function (name, date) {
            console.log('router: recomendationsPage');
            var myDate = date;
            if (!myDate) {
                myDate = wsisConstants.getTodaysDate();
            }
            this.reccDetailsView.retrieveReccData(name, myDate);
            // $('#resortdetailPage').show();
            this.hideSearchPage();
            this.selectMenuItem('resorts');
        },

        resortListingPage: function () {
            console.log('router: resortListingPage');
            var resortListingView = new ResortListingView();
            this.hideSearchPage();
            this.selectMenuItem('resorts');
        },

        showSearchPage: function () {
            $(this.sections.searchPage).show();
            $(this.sections.nonSearchPage).hide();
        },

        hideSearchPage: function () {
            $(this.sections.searchPage).hide();
            $(this.sections.nonSearchPage).show();
        },

        selectMenuItem: function (item) {
            //deactivate all menu items first
            $.each(wsisConstants.menuOptions, function (index, value) {
                $('#' + value).removeClass('active');
            });

            $('#' + item).addClass('active');
        }
    });
    return Workspace;
});
