/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/allResortsModel',
    'lib/wsisConstants'

], function ($, _, Backbone, JST, wsisConstants) {
    'use strict';
    var ResortListingView = Backbone.View.extend({

        template: JST['app/scripts/templates/all-resorts.hbs'],

        el: '#nonSearchContainer',
        model: new Backbone.Model(),
        
        // className: '',

        events: {},

        initialize: function () {
            // this.model.set({'_id':'eric'});
            // this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            // this.model = new Recommendation();
            // this.model = {'new' : 'eric' };
            // this.model.fetch();
            // this.model.urlRoot = wsisConstants.searchApiBase + 'allResortData=T';
            this.model.urlRoot = 'scripts/server/resorts.json';
            this.model.fetch();
            this.render();
            // this.render();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }

    });
    return ResortListingView;

});
