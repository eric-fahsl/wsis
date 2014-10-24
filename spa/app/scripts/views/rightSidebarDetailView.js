/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/reccDetailModel',
    'lib/wsisConstants'
], function ($, _, Backbone, JST, ReccModel, wsisConstants) {
    'use strict';

    var RightSidebarDetailView = Backbone.View.extend({

        template: JST['app/scripts/templates/right-sidebar-detail.hbs'],
        el: '#rdp_sidebar',
        model: new ReccModel(),

        // tagName: 'section',

        // id: '',

        // className: 'col-md-3',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            // this.retrieveResortData();
            // console.log('initialize');
            // this.render();
        },

        retrieveResortData: function (resortName) {
            this.model.urlRoot = wsisConstants.searchApiBase + 'resortData=' + resortName.split('/')[0];
            this.model.retrieve();
        },

        render: function () {
            // this.$el.html(this.template());
            // this.$el.html(this.template(this.model.toJSON()));
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }

    });
    return RightSidebarDetailView;

});
