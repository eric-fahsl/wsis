/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',

], function ($, _, Backbone, JST, module) {
    'use strict';

    var FeedbackView = Backbone.View.extend({

        // template: JST['app/scripts/templates/feedback.hbs'],
        template: '/scripts/templates/feedback.html',
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
            // this.$el.html(this.template());
            var that = this;
            $.get(this.template, function (data) {
                that.$el.html(data);
            });
        }

    });
    return FeedbackView;

});
