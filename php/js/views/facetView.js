var app = app || {};

app.FacetView = Backbone.View.extend({
    tagName: 'li',
    template: _.template( $( '#facet-template' ).html() ),

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        var termValue = this.model.attributes.term;
        this.$el.attr('id', 'F-' + termValue).html( this.template( this.model.toJSON() ));

        return this;
    }
});