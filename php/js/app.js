// js/app.js

var app = app || {};

function errorHandler() { init(); }

function success_handler(position) {
    var coords = position.coords.latitude + "," + position.coords.longitude;
    $.cookie("coords", coords, { expires: 1 });
    location.reload();
}

$(function() {
    if (! $.cookie("coords")) {
        if(navigator.geolocation) {
            // Geolocation supported. Do something here.
            var geolocation = navigator.geolocation;
            geolocation.getCurrentPosition(success_handler, errorHandler);
        }
    }
    app.SearchResults = new app.SearchResultsView();
    app.ReccRouter = new Workspace();
    Backbone.history.start();
});