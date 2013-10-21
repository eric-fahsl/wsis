var app = app || {};

app.DateList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.DateModel,

    clearAll: function() {
        //_.each(this.models, function(model){ model.destroy(); });
        while (this.models.length) {
            this.models[0].destroy();
        }
    }
});

// Create our global collection of **Todos**.
//app.Reccs = new ReccList();