/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
],
    function ($, _, Backbone, JST) {
        'use strict';

        var SortView = Backbone.View.extend({
            tagName: 'option',
            // template: _.template($('#facet-sort').html()),
            template: JST['app/scripts/templates/facet-sort.hbs'],

            events: {
                'click': 'sortChange'
            },

            initialize: function () {
                this.listenTo(this.model, 'destroy', this.remove);
            },

            render: function () {
                this.$el.attr('selected', this.model.get('selected')).attr('value', this.model.get('url'))
                    .html(this.template(this.model.toJSON()));
                return this;
            },

            sortChange : function (e) {
                console.log(e);
                window.location = this.model.get('url');
            },

            setParentView: function (parentView) {
                this.parentView = parentView;
            }
        });
        return SortView;
    });