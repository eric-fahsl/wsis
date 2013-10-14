// js/collections/reccs.js

var app = app || {};

app.ReccList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.Recc,
    // Store the search facets
    facets: {},
    url: 'http://localhost/lib/reccapi.php?size=30&date=2013-10-02&coords=46.3096738,-119.2755485&fields=t',
//    url: '/lib/sampleResponse.json',
    parse: function(response) {
        //console.log(response);
        this.facets = response.facets;
        return response.results;
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