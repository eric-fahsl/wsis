// js/views/reccsView.js

var app = app || {};

// The DOM element for a recommendation item...
app.ReccListView = Backbone.View.extend({

    el: "#recommendations",

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
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        //this.collection = new app.ReccList(reccs);
        this.collection = new app.ReccList();
        //this.collection.fetch({reset: true});
        var that = this;
        this.collection.fetch({
            success: function () {
                that.render();
            }
        });
        //this.collection = new app.Reccs();
        //this.collection.fetch({reset: true});
        //this.listenTo(this.model, 'change', this.render);
        //this.listenTo(this.model, 'destroy', this.remove);        // NEW
//        this.listenTo(this.model, 'visible', this.toggleVisible); // NEW
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
    },

    // render a book by creating a BookView and appending the
    // element it renders to the library's element
    renderRecc: function( item ) {
        var reccView = new app.ReccView({
            model: item
        });
        this.$el.append( reccView.render().el );
    }

});