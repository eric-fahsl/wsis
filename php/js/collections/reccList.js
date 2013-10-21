// js/collections/reccs.js

var app = app || {};

app.ReccList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.Recc,
    // Store the search facets

    clearAll: function() {
//        _.each(this.models, function(model){ model.destroy(); });
        while (this.models.length) {
            this.models[0].destroy();
        }
    }

});

// Create our global collection of **Todos**.
//app.Reccs = new ReccList();