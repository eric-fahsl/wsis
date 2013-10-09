// js/collections/reccs.js

var app = app || {};

app.ReccList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.Recc,
    url: '/lib/reccapi.php?size=30&startDate=2013-10-07&coords=46.3096738,-119.2755485',
//    url: '/lib/sampleResponse.json',
    parse: function(response) {
        return response;
    },

    clearAll: function() {
        while (this.models.length) {
            this.models[0].destroy();
        }
    }
});

// Create our global collection of **Todos**.
//app.Reccs = new ReccList();