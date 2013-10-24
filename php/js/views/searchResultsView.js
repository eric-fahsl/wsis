// js/views/reccsView.js

var app = app || {};

// The DOM element for a recommendation item...
app.SearchResultsView = Backbone.View.extend({

    el: "#container",
    recommendationsEl: "#searchResults",
    facetEl: "#facets",

    facets: { date: "2013-10-25"},
    resultsCollection: {},
    facetCollection: {},
    dateHeaderCollection: {},
    initialized: false,

    // Cache the template function for a single item.
    template: _.template( $('#recc-template').html() ),

    // The DOM events specific to an item.
    events: {
        /*
        'click .toggle': 'togglecompleted', // NEW
        'dblclick label': 'edit',
        'click .destroy': 'clear',           // NEW
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close' */
//        "click #dateFacets li" : 'dateFacetClick',
//        "click #regionFacets li" : 'regionFacetClick',
//        "click #stateFacets li" : 'stateFacetClick',
//        "click #distanceFacets li" : 'distanceFacetClick'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    init: function() {
        //this.collection = new app.ReccList(reccs);
        this.collection = new app.SearchResult();
        this.dateHeaderCollection = new app.DateList();
        var tempReccList = new app.ReccList();
        this.facetCollection = {date:tempReccList, region:tempReccList, state:tempReccList};
//        this.refreshData();
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

        /*
        //Delete the search results
        this.dateHeaderCollection.clearAll();

        $.each(this.resultsCollection, function(i, v){
            v.clearAll();
        });
        //Delete the facets
        $.each(this.facetCollection, function(i, v) {
            v.clearAll();
        });
        */

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

                that.dateHeaderCollection = new app.DateList();

                $.each(model.results, function (i, v) {
                    that.dateHeaderCollection.add(new app.DateModel({date: i}));
                    that.resultsCollection[i] = new app.ReccList(v);
                });

                $.each(that.facetCollection, function(i, v) {
                    that.facetCollection[i] = new app.FacetList(model.facets[i].terms,
                        {facets: that.facets, facetType: i} );
                });
                if (that.collection.facets.distance) {
                    that.facetCollection.distance = new app.FacetList(model.facets.distance.ranges,
                        {facets: that.facets, facetType: "distance"} );
                }
                that.render();
            }
        });
    },

    render: function() {
//        this.collection.each(function( item ) {
//            this.renderRecc( item );
//        }, this );

        var that = this;
//        this.dateHeaderCollection.each(function (item) {
//            var reccHeaderView = new app.ReccHeaderView({
//                model: item
//            });
//            $(that.recommendationsEl).append(reccHeaderView.render().el);
//        });
        var count = 0;
        $.each(this.resultsCollection, function(i, v) {
            var reccHeaderView = new app.ReccHeaderView({
                model: that.dateHeaderCollection.models[count++]
            });
            $(that.recommendationsEl).append(reccHeaderView.render().el);
            v.each(function (item) {
                that.renderRecc(item, i);
            });
        });

        $.each(this.facetCollection, function(i, v) {
            v.each(function (item) {
                that.renderFacet(item, i);
            });
        });

//        this.facetCollectionRegion.each(function (item) {
//            this.renderFacet(item, 'region');
//        }, this);
//        this.facetCollectionState.each(function (item) {
//            this.renderFacet(item, 'state');
//        }, this);
//        that = this;
//        $.each( this.collection.facets.Region.terms, function(i, v){
//            that.renderFacet(v);
//        });
        var that = this;
        $.each(this.facets, function(i, v) {
             that.toggleFacet(v);
        });
    },

    renderRecc: function( item, date ) {
        var reccView = new app.ReccView({
            model: item
        });
        $(this.recommendationsEl).append( reccView.render().el );
    },

    renderFacet: function (facet, facetType) {
        if (facetType != 'distance' || facet.attributes.total_count > 0){
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

    toggleFacet: function(facetName) {
        var facetid = "#F_" + facetName;
        var xid = "#X_" + facetName;
        $(facetid).addClass("selected");
        $(xid).show();
    }

});