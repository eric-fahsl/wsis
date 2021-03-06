var app = app || {};

app.SortView = Backbone.View.extend({
    tagName: 'option',
    template: _.template( $( '#facet-sort' ).html() ),

    events: {
        "click": "sortChange"
    },

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
//        this.template = _.template('<option value="<%= url%>"><%= displayValue %></option>');
    },

    render: function() {
//        if (this.model.selected) {
//            this.$el.attr('selected', '');
//        }
        this.$el.attr('selected', this.model.get('selected')).attr('value', this.model.get('url')).html( this.template( this.model.toJSON() ));
        return this;
    },

    sortChange : function(e) {
        console.log(e);
        window.location = this.model.get("url");
    },

    setParentView: function(parentView) {
        this.parentView = parentView;
    }
});