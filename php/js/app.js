// js/app.js

var app = app || {};

$(function() {

    app.SearchResults = new app.SearchResultsView();
    app.ReccRouter = new Workspace();
    Backbone.history.start();

});