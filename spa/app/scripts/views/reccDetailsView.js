/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/reccDetailModel',
    'views/rightSidebarDetailView',
    'lib/wsisConstants'

], function ($, _, Backbone, JST, Recommendation, RightSidebarView, wsisConstants) {
    'use strict';
    var ReccDetailsView = Backbone.View.extend({

        template: JST['app/scripts/templates/reccDetailsView.hbs'],

        el: '#nonSearchContainer',
        model: new Recommendation(),
        rightSidebarView: new RightSidebarView(),

        // className: '',

        events: {},

        initialize: function () {
            // this.model.set({'_id':'eric'});
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.overrideRemove);
            // this.model = new Recommendation();
            // this.model = {'new' : 'eric' };
            // this.model.fetch();
        },

        retrieveReccData: function (name, date) {
            this.model.urlRoot = wsisConstants.searchApiBase + 'resort=' + name + '&date=' + date;
            this.model.fetch();

            this.rightSidebarView.retrieveResortData(name);
        },

        overrideRemove: function () {
            this.rightSidebarView.model.destroy();
            this.remove();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.append(this.rightSidebarView.render().el);
        }

    });
    return ReccDetailsView;

});
