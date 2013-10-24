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
//        var termValue = "";
//        if (this.model.attributes.term) {
//            termValue = this.model.attributes.term;
//            this.model.set({displayValue: termValue});
//            if (termValue.substring(0,3) == '201') {
//                this.model.set({displayValue:
//                    new Date(Date.parse(termValue + " GMT-1100")).toDateString()});
//
//            }
//        }
//        if (this.model.attributes.to) {
//            var termValue = this.model.attributes.to;
//            this.model.set({displayValue:termValue});
//            this.template = _.template( $( '#facet-template-distance' ).html() );
//        }

        this.$el.attr('id', 'F_' + this.model.get("term")).html( this.template( this.model.toJSON() ));

        return this;
    },

    facetClick : function(e) {
        console.log(e);
        window.location = this.model.get("url");

    },

    setParentView: function(parentView) {
        this.parentView = parentView;
    }
});