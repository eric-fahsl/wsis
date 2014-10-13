/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'

], function ($, _, Backbone, JST) {
    'use strict';

    var AboutView = Backbone.View.extend({

        template: JST['app/scripts/templates/about.hbs'],
        el: '#nonSearchContent',

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
            console.log('in render');
            this.$el.html(this.template());
        }

    });
    return AboutView;

});
