/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'

], function ($, _, Backbone, JST) {
    'use strict';

    var ReccView = Backbone.View.extend({
        tagName: 'div',
        className: 'reccView',
        template: _.template($('#recc-template').html()),

        initialize: function () {
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            //this.el is what we defined in tagName. use $el to get access to jQuery html() function
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }

    });
    return ReccView;
});