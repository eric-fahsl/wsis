// js/views/reccsView.js

var app = app || {};

// The DOM element for a recommendation item...
app.SearchResultsView = Backbone.View.extend({

    el: "#searchContainer",
    recommendationsEl: "#searchResults",
    facetEl: "#facets",
    sortEl: "#search_sort",

    facets: {},
    resultsCollection: {},
    facetCollection: {},
    dateHeaderCollection: {},
    sortOptions: {},
    initialized: false,
    mobileFacetsShown: false,
    distanceFacetHeaderId: "#distanceHeader",

    // Cache the template function for a single item.
    template: _.template( $('#recc-template').html() ),

    // The DOM events specific to an item.
    events: {
        'click #toggleFilters': 'toggleFilters'
        //'change #search_sort': 'sortClick'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    init: function() {
        //this.collection = new app.ReccList(reccs);
        this.collection = new app.SearchResult();
        this.dateHeaderCollection = new app.DateList();
        var tempReccList = new app.ReccList();
        this.facetCollection = {date:tempReccList, region:tempReccList, state:tempReccList, powder:tempReccList};
        this.sortOptions = {"powder":"Powder", "quality":"Snow Quality (BETA)","bluebird":"Bluebird", "fl":"Freezing Level"};
        this.sortModels = {};
        var that = this;
        $(this.sortEl).change(function() {
            window.location = $(that.sortEl + " option:selected")[0].value;
        });
        $("#loadingImage").hide();
    },

    testMethod: function() {
        this.facets = {};
        this.refreshData();
    },

    refreshData: function(facets) {
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

                $.each(that.resultsCollection, function(i, v){
                    v.clearAll();
                });
                that.resultsCollection = {};
                //Delete the facets
                $.each(that.facetCollection, function(i, v) {
                    v.clearAll();
                });
                //Delete the sort options
                $.each(that.sortModels, function(i, v) {
                    v.destroy();
                });
                that.sortModels = {};

                that.dateHeaderCollection = new app.DateList();

                $.each(model.results, function (i, v) {
                    that.dateHeaderCollection.add(new app.DateModel({date: i}, that.facets));
                    that.resultsCollection[i] = new app.ReccList(v);
                });

                $.each(that.facetCollection, function(i, v) {
                    var models = model.facets[i];
                    if (models.terms) models = models.terms;
                    else if (models.ranges) models = models.ranges;
                    that.facetCollection[i] = new app.FacetList(models,
                        {facets: that.facets, facetType: i} );
                });
                if (that.collection.facets.distance) {
                    that.facetCollection.distance = new app.FacetList(model.facets.distance.ranges,
                        {facets: that.facets, facetType: "distance"} );
                    that.sortOptions.distance = "Distance";
                } else {
                    $(that.distanceFacetHeaderId).hide();
                }
                $.each(that.sortOptions, function (i, v){
                    that.sortModels[i] = new app.SortOption({sort:i, displayValue: v}, that.facets);
                });

                that.render();
            }
        });
    },

    render: function() {


        var that = this;
        var count = 0;
        //Create the sort options
        $.each(this.sortModels, function(i,v) {
            var sortView = new app.SortView({model: v});
            $(that.sortEl).append(sortView.render().el);
        });

        //Create recommendation Views
        $.each(this.resultsCollection, function(i, v) {
            var reccHeaderView = new app.ReccHeaderView({
                model: that.dateHeaderCollection.models[count++]
            });
            $(that.recommendationsEl).append(reccHeaderView.render().el);
            v.each(function (item) {
                that.renderRecc(item, i);
            });
        });

        //Create Facet Views
        $.each(this.facetCollection, function(i, v) {
            v.each(function (item) {
                that.renderFacet(item, i);
            });
        });

        //Toggle the displayed facets
        $.each(this.facets, function(i, v) {
             that.toggleFacet(v);
        });
        this.hideFacets();
    },

    renderRecc: function( item, date ) {
        var reccView = new app.ReccView({
            model: item
        });
        $(this.recommendationsEl).append( reccView.render().el );
    },

    renderFacet: function (facet, facetType) {
        if (!(facetType == 'powder' || facetType=='distance') || facet.attributes.total_count > 0){
            var facetView = new app.FacetView({
                model: facet
            });
            facetView.setParentView(this);
            $('#' + facetType + 'Facets').append(facetView.render().el);
        }
    },

    dateFacetClick: function(e) {
        this.facetClick(e, "date");
    },
    regionFacetClick: function(e) {
        this.facetClick(e, "region");
        //window.location= "#search/region=PacificNW";
    },
    stateFacetClick: function(e) {
        this.facetClick(e, "state");
    },
    distanceFacetClick: function(e) {
        this.facetClick(e, "distance");
    },

    facetClick: function(e, facetType) {
        var text = e.currentTarget.id.split('_')[1];
        if (this.facets[facetType] == text)
            delete this.facets[facetType];
        else
            this.facets[facetType] = text;
        this.refreshData();
    },

    sortClick: function(e) {
      console.log(e);
    },

    toggleFacet: function(facetName) {
        var facetid = "#F_" + facetName;
        var xid = "#X_" + facetName;
        $(facetid).addClass("selected");
        $(xid).show();
    },

    toggleFilters: function() {
        if (!this.mobileFacetsShown)
            this.showFacets();
        else
            this.hideFacets();
    },

    hideFacets: function() {
        $(this.facetEl).addClass("hidden-phone");
        this.mobileFacetsShown = false;
    },
    showFacets: function() {
        $(this.facetEl).removeClass("hidden-phone");
        this.mobileFacetsShown = true;
    }


});