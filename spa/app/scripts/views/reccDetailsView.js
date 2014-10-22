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

        // className: '',

        events: {},

        initialize: function () {
            // this.model.set({'_id':'eric'});
            this.listenTo(this.model, 'change', this.render);
            // this.model = new Recommendation();
            // this.model = {'new' : 'eric' };
            // this.model.fetch();
        },

        retrieveResortData: function (name, date) {
            this.model.urlRoot = wsisConstants.searchApiBase + 'resort=' + name + '&date=' + date;
            this.model.fetch();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON({})));
            var rightSidebarView = new RightSidebarView();
        }

    });
    return ReccDetailsView;

});
