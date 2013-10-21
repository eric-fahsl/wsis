// js/views/reccsView.js

var app = app || {};

// The DOM element for a recommendation item...
app.ReccListView = Backbone.View.extend({

    el: "#container",
    recommendationsEl: "#recommendations",
    facetEl: "#facets",

    facets: { dateStart: "2013-10-19"},
    resultsCollection: {},
    facetCollection: {},

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
        "click #dateFacets li" : 'dateFacetClick',
        "click #regionFacets li" : 'regionFacetClick',
        "click #stateFacets li" : 'stateFacetClick',
        "click #distanceFacets li" : 'distanceFacetClick'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        //this.collection = new app.ReccList(reccs);
        this.collection = new app.ReccList();

        this.facetCollection['date'] = new app.FacetList();
        this.facetCollection['region'] = new app.FacetList();
        this.facetCollection['state'] = new app.FacetList();
        this.facetCollectionDistance = new app.FacetList();

        this.refreshData();
    },

    refreshData: function() {
        //this.collection.clearAll();
        $.each(this.facetCollection, function(i, v) {
            v.clearAll();
        });

        var that = this;
        this.collection.fetch({
            data: $.param(this.facets),
            success: function (model) {
                $.each(that.collection.results, function (i, v) {
                    that.resultsCollection[i] = new app.ReccList(v);
                });

                $.each(that.facetCollection, function(i, v) {
                    that.facetCollection[i] = new app.FacetList(that.collection.facets[i].terms);
                });
                if (that.collection.facets.distance) {
                    that.facetCollection.distance = new app.FacetList(that.collection.facets.distance.ranges);
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
        $.each(this.resultsCollection, function(i, v) {
            v.each(function (item) {
                that.renderRecc(item);
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

    // render a book by creating a BookView and appending the
    // element it renders to the library's element
    renderRecc: function( item ) {
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
            $('#' + facetType + 'Facets').append(facetView.render().el);
        }
    },

    dateFacetClick: function(e) {
        this.facetClick(e, "date");
    },
    regionFacetClick: function(e) {
        this.facetClick(e, "region");
    },
    stateFacetClick: function(e) {
        this.facetClick(e, "state");
    },
    distanceFacetClick: function(e) {
        this.facetClick(e, "distance");
    },

    facetClick: function(e, facetType) {
        var text = e.target.id.split('_')[1];
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