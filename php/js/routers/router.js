// js/routers/router.js

var Workspace = Backbone.Router.extend({
    routes:{
        'search/:query': 'setFilter',
        '*clear': 'clear'
    },

    setFilter: function( param ) {
        // Set the current filter to be used
        if (param) {
            param = param.trim();
        }

        console.log(param);
//        app.TodoFilter = param || '';
//
//        // Trigger a collection filter event, causing hiding/unhiding
//        // of Todo view items
//        app.Todos.trigger('filter');
    },
    clear: function () {
        //app.SearchResults.testMethod();
    }
});

app.ReccRouter = new Workspace();
Backbone.history.start();