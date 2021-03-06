var app = app || {};

app.SearchResult = Backbone.Collection.extend({

    // Reference to this collection's model. Only a placeholder for two sub-models
    model: app.Recc,
    // Store the search facets and results
    facets: {},
    results: {},

    url: '/lib/reccapi.php?fields=t',
    initialize: function() {
        if ($.cookie("coords")) {
            this.url += "&coords=" + $.cookie("coords");
        }
    },

    parse: function(response) {
        //console.log(response);
        this.facets = response.facets;
        this.results = response.results;
        //return response;
        return {};
    },

    clearAll: function() {
//        _.each(this.models, function(model){ model.destroy(); });
        while (this.models.length) {
            this.models[0].destroy();
        }
    }

});

// Create our global collection of **Todos**.
//app.Reccs = new ReccList();