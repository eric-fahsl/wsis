var app = app || {};

app.FacetList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.Facet,
    facetType: "",
    facets: {},
    // Store the search facets

    initialize: function(models, options) {
        if (options) {
            this.facets = options.facets;
            this.facetType = options.facetType;
        }
    },

    clearAll: function() {
        //_.each(this.models, function(model){ model.destroy(); });
        while (this.models.length) {
            this.models[0].destroy();
        }
    }
});

// Create our global collection of **Todos**.
//app.Reccs = new ReccList();