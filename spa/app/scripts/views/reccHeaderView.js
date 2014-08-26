// site/js/views/book.js

var app = app || {};

app.ReccHeaderView = Backbone.View.extend({
    tagName: "span",
    //className: "span11",
    template: _.template( $( '#recc-date-template' ).html() ),

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        this.$el.html( this.template( this.model.toJSON() ) );

        return this;
    }

});