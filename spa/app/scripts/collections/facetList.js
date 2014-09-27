/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/facet'

], function ($, _, Backbone, JST, Facet) {
    'use strict';

    var FacetList = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Facet,
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
    return FacetList;
});
// Create our global collection of **Todos**.
//app.Reccs = new ReccList();