// js/routers/router.js
//var app = app || {};

var Workspace = Backbone.Router.extend({
    routes:{
        'search/:query': 'searchQuery',
        '': 'searchQuery',
        'search/': 'searchQuery'
    },

    searchQuery: function( param ) {
        var facets = {};

        if (param) {
            param = param.trim();

            var params = param.split("&");

            for (var i in params) {
                var values = params[i].split("=");
                facets[values[0]] = values[1];
            }
        }

        app.SearchResults.refreshData(facets);
    },
    clear: function () {
        app.SearchResults.testMethod();
    }
});
