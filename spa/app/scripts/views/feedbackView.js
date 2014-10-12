/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',

], function ($, _, Backbone, JST, module) {
    'use strict';

    var FeedbackView = Backbone.View.extend({

        template: JST['app/scripts/templates/feedback.ejs'],
        el: '#nonSearchContainer',

        // tagName: 'div',

        // id: '',

        // className: '',

        events: {},

        initialize: function () {
            // this.listenTo(this.model, 'change', this.render);
            // console.log('initialize');
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
        }

    });
    return FeedbackView;

});
