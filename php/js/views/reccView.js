// site/js/views/book.js

var app = app || {};

app.ReccView = Backbone.View.extend({
    tagName: 'div',
    className: 'reccView span2',
    template: _.template( $( '#recc-template' ).html() ),

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        this.$el.html( this.template( this.model.toJSON() ) );

        return this;
    }

});