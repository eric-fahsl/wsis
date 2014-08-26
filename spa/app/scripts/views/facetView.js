var app = app || {};

app.FacetView = Backbone.View.extend({
    tagName: 'li',
    template: _.template( $( '#facet-template' ).html() ),

    events: {
        "click" : 'facetClick'
    },

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        this.$el.attr('id', 'F_' + this.model.get("term")).html( this.template( this.model.toJSON() ));
        return this;
    },

    facetClick : function(e) {
        window.location = this.model.get("url");

    },

    setParentView: function(parentView) {
        this.parentView = parentView;
    }
});