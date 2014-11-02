/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'collections/searchResult',
    'collections/dateList',
    'collections/reccList',
    'collections/facetList',
    'models/dateModel',
    'models/sortOption',
    'views/sortView',
    'views/reccHeaderView',
    'views/facetView',
    'views/reccView'

], function ($, _, Backbone, JST, SearchResult, DateList, ReccList, FacetList, DateModel, SortOption, SortView, ReccHeaderView, FacetView, ReccView) {
    'use strict';
    
    var SearchResultsView = Backbone.View.extend({

        el: '#searchContainer',
        recommendationsEl: '#searchResults',
        facetEl: '#facets',
        sortEl: '#search_sort',

        facets: {},
        resultsCollection: {},
        facetCollection: {},
        dateHeaderCollection: {},
        sortOptions: {},
        initialized: false,
        mobileFacetsShown: false,
        distanceFacetHeaderId: '#distanceHeader',
        refreshedOnce: false,

        // Cache the template function for a single item.
        // template: _.template($('#recc-template').html()),
        template: JST['app/scripts/templates/recc-template.hbs'],

        // The DOM events specific to an item.
        events: {
            'click #toggleFilters': 'toggleFilters'
            //'change #search_sort': 'sortClick'
        },

        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        init: function () {
            
            this.collection = new SearchResult();
            this.dateHeaderCollection = new DateList();
            var tempReccList = new ReccList();
            this.facetCollection = {date: tempReccList, region: tempReccList, state: tempReccList, powder: tempReccList};
            this.sortOptions = {'powder': 'Powder', 'quality': 'Snow Quality (BETA)', 'bluebird': 'Bluebird', 'fl': 'Freezing Level'};
            this.sortModels = {};
            var that = this;
            $(this.sortEl).change(function () {
                window.location = $(that.sortEl + ' option:selected')[0].value;
            });
            this.checkLocation();
            $('#loadingImage').hide();
        },

        testMethod: function () {
            this.facets = {};
            this.refreshData();
        },

        refreshData: function (facets) {
            if (!this.initialized) {
                this.init();
                this.initialized = true;
            }
            //if facets are passed in from router, override current facets
            if (facets)
                this.facets = facets;


            var that = this;
            this.collection.fetch({
                data: $.param(this.facets),
                success: function (model) {

                    //Delete the search results
                    that.dateHeaderCollection.clearAll();

                    $.each(that.resultsCollection, function (i, v) {
                        v.clearAll();
                    });
                    that.resultsCollection = {};
                    //Delete the facets
                    $.each(that.facetCollection, function (i, v) {
                        v.clearAll();
                    });
                    //Delete the sort options
                    $.each(that.sortModels, function (i, v) {
                        v.destroy();
                    });
                    that.sortModels = {};

                    that.dateHeaderCollection = new DateList();

                    $.each(model.results, function (i, v) {
                        that.dateHeaderCollection.add(new DateModel({date: i}, that.facets));
                        that.resultsCollection[i] = new ReccList(v);
                    });

                    $.each(that.facetCollection, function (i, v) {
                        var models = model.facets[i];
                        if (models.terms) models = models.terms;
                        else if (models.ranges) models = models.ranges;
                        that.facetCollection[i] = new FacetList(models,
                            {facets: that.facets, facetType: i});
                    });
                    if (that.collection.facets.distance) {
                        that.facetCollection.distance = new FacetList(model.facets.distance.ranges,
                            {facets: that.facets, facetType: 'distance'});
                        that.sortOptions.distance = 'Distance';
                    } else {
                        $(that.distanceFacetHeaderId).hide();
                    }
                    $.each(that.sortOptions, function (i, v) {
                        that.sortModels[i] = new SortOption({sort: i, displayValue: v}, that.facets);
                    });

                    that.render();
                }
            });
        },

        render: function () {


            var that = this;
            var count = 0;
            //Create the sort options
            $.each(this.sortModels, function (i, v) {
                var sortView = new SortView({model: v});
                $(that.sortEl).append(sortView.render().el);
            });

            //Create recommendation Views
            $.each(this.resultsCollection, function (i, v) {
                var reccHeaderView = new ReccHeaderView({
                    model: that.dateHeaderCollection.models[count++]
                });
                $(that.recommendationsEl).append(reccHeaderView.render().el);
                v.each(function (item) {
                    that.renderRecc(item, i);
                });
            });

            //Create Facet Views
            $.each(this.facetCollection, function (i, v) {
                v.each(function (item) {
                    that.renderFacet(item, i);
                });
            });

            //Toggle the displayed facets
            $.each(this.facets, function (i, v) {
                that.toggleFacet(v);
            });
            this.hideFacets();
            $(this.el).show();
        },

        renderRecc: function (item, date) {
            var reccView = new ReccView({
                model: item
            });
            $(this.recommendationsEl).append(reccView.render().el);
        },

        renderFacet: function (facet, facetType) {
            if (!(facetType === 'powder' || facetType === 'distance') || facet.attributes.total_count > 0) {
                var facetView = new FacetView({
                    model: facet
                });
                facetView.setParentView(this);
                $('#' + facetType + 'Facets').append(facetView.render().el);
            }
        },

        dateFacetClick: function (e) {
            this.facetClick(e, 'date');
        },
        regionFacetClick: function (e) {
            this.facetClick(e, 'region');
            //window.location= '#search/region=PacificNW';
        },
        stateFacetClick: function (e) {
            this.facetClick(e, 'state');
        },
        distanceFacetClick: function (e) {
            this.facetClick(e, 'distance');
        },

        facetClick: function (e, facetType) {
            var text = e.currentTarget.id.split('_')[1];
            if (this.facets[facetType] === text)
                delete this.facets[facetType];
            else
                this.facets[facetType] = text;
            this.refreshData();
        },

        sortClick: function (e) {
            console.log(e);
        },

        toggleFacet: function (facetName) {
            var facetid = '#F_' + facetName;
            var xid = '#X_' + facetName;
            $(facetid).addClass('selected');
            $(xid).show();
        },

        toggleFilters: function () {
            if (!this.mobileFacetsShown)
                this.showFacets();
            else
                this.hideFacets();
        },

        hideFacets: function () {
            $(this.facetEl).addClass('hidden-xs');
            this.mobileFacetsShown = false;
        },
        showFacets: function () {
            $(this.facetEl).removeClass('hidden-xs');
            this.mobileFacetsShown = true;
        },

        showDistanceFilters: function (refreshResults) {
            if (refreshResults && !this.refreshedOnce) {
                //reset the search result to consider location
                this.collection = new SearchResult();
                this.refreshData();
                this.refreshedOnce = true;
            }
            $('#distanceHeader').slideDown();
            $('#distanceSection').slideDown();
            $('#distanceSort').show();
        },
        errorHandler: function () {
            console.log('Geolocation not enabled');
        },

        success_handler: function (position) {
            var coords = position.coords.latitude + ',' + position.coords.longitude;
            $.cookie('coords', coords, { expires: 1 });
            window.searchResultsView.showDistanceFilters(true);
            
        },

        checkLocation: function (facets) {
            if ($.cookie('coords')) {
                this.showDistanceFilters(false);
            } else {
                if (navigator.geolocation) {
                    // Geolocation supported. Do something here.
                    var geolocation = navigator.geolocation;
                    geolocation.getCurrentPosition(this.success_handler, this.errorHandler);
                }
            }
        }


    });

    return SearchResultsView;
});