/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'

], function ($, _, Backbone, JST) {
    'use strict';

    var FacetView = Backbone.View.extend({
        tagName: 'li',
        // template: _.template($('#facet-template').html()),
        template: JST['app/scripts/templates/facet-template.hbs'],

        events: {
            'click' : 'facetClick'
        },

        initialize: function () {
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            this.$el.attr('id', 'F_' + this.model.get('term')).html(this.template(this.model.toJSON()));
            return this;
        },

        facetClick : function (e) {
            window.location = this.model.get('url');

        },

        setParentView: function (parentView) {
            this.parentView = parentView;
        }
    });
    return FacetView;
});