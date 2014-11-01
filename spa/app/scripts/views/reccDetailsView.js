/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/reccDetailModel',
    'views/nearbyResortsView',
    'lib/wsisConstants'

], function ($, _, Backbone, JST, Recommendation, NearbyResortsView, wsisConstants) {
    'use strict';
    var ReccDetailsView = Backbone.View.extend({

        template: JST['app/scripts/templates/reccDetailsView.hbs'],

        el: '#nonSearchContainer',
        model: new Recommendation(),
        nearbyResortsView: new NearbyResortsView(),
        // rightSidebarView: new RightSidebarView(),

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
            console.log('reccDetailsView: retrieveReccData');
            this.model.urlRoot = wsisConstants.searchApiBase + 'resort=' + name + '&date=' + date;
            this.model.fetch();
            // this.render();
            // this.rightSidebarView.retrieveResortData(name);

        },

        overrideRemove: function () {
            this.rightSidebarView.model.destroy();
            this.remove();
        },

        render: function () {
            console.log('reccDetailsView: render()');
            this.$el.html(this.template(this.model.toJSON()));
            // this.$el.append(this.rightSidebarView.render().el);
            this.nearbyResortsView.retrieveNearbyResorts(this.model.get('date'), this.model.get('resortData').latitude, this.model.get('resortData').longitude);
            // this.$el.append(this.nearbyResortsView.render().el);
            // this.nearbyResortsView.render();
        }

    });
    return ReccDetailsView;

});
