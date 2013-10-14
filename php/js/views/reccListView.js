// js/views/reccsView.js

var app = app || {};

// The DOM element for a recommendation item...
app.ReccListView = Backbone.View.extend({

    el: "#container",
    recommendationsEl: "#recommendations",
    facetEl: "#facets",

    facets: {date: '2013-09-30'},

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
        "click #regionFacets li" : 'regionFacetClick',
        "click #stateFacets li" : 'stateFacetClick'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        //this.collection = new app.ReccList(reccs);
        this.collection = new app.ReccList();
        this.facetCollectionRegion = new app.FacetList();
        this.facetCollectionState = new app.FacetList();
        //this.collection.fetch({reset: true});

        this.refreshData();
    },

    refreshData: function() {
        this.collection.clearAll();
        this.facetCollectionRegion.clearAll();
        this.facetCollectionState.clearAll();
        var that = this;
        this.collection.fetch({
            data: $.param(this.facets),
            success: function (model) {
                that.facetCollectionRegion = new app.FacetList(that.collection.facets.Region.terms);
                that.facetCollectionState = new app.FacetList(that.collection.facets.State.terms);
                that.render();
            }
        });
    },

//    // Re-render the recommendations of the recc item.
//    render: function() {
//        this.$el.html( this.template( this.model.toJSON() ) );
//        return this;
//    },

    // render library by rendering each book in its collection
    render: function() {
        this.collection.each(function( item ) {
            this.renderRecc( item );
        }, this );


        this.facetCollectionRegion.each(function (item) {
            this.renderFacet(item, 'region');
        }, this);
        this.facetCollectionState.each(function (item) {
            this.renderFacet(item, 'state');
        }, this);
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
        var facetView = new app.FacetView({
            model: facet
        });
        $('#' + facetType + 'Facets').append(facetView.render().el);
    },

    regionFacetClick: function(e) {
        this.facetClick(e, "region");
    },
    stateFacetClick: function(e) {
        this.facetClick(e, "state");
    },

    facetClick: function(e, facetType) {
        var text = e.target.id.split('-')[1];
        if (this.facets[facetType] == text)
            delete this.facets[facetType];
        else
            this.facets[facetType] = text;
        this.refreshData();
    },

    toggleFacet: function(facetName) {
        var facetid = "#F-" + facetName;
        var xid = "#X-" + facetName;
        $(facetid).addClass("selected");
        $(xid).show();
    }

});