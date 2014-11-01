/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'collections/searchResult',
    'lib/wsisConstants',
    'views/reccView',
    'models/recc'
], function ($, _, Backbone, JST, SearchResult, wsisConstants, ReccView, ReccModel) {
    'use strict';

    var NearbyResortsView = Backbone.View.extend({

        // template: JST['app/scripts/templates/right-sidebar-detail.hbs'],
        template: '',
        el: '#nonSearchContainer',
        collection: new SearchResult(),
        // resultsCollection: {},

        tagName: 'section',

        id: 'nearbyResorts',

        className: 'col-md-12',

        initialize: function () {
            // this.listenTo(this.collection, 'change', this.render);
            // this.listenTo(this.model, 'destroy', this.remove);
            // this.retrieveResortData();
            // console.log('initialize');
            // this.render();

        },

        retrieveNearbyResorts: function (date, lat, lon) {
            // this.model.urlRoot = wsisConstants.searchApiBase + 'resortData=' + resortName.split('/')[0];
            // this.model.retrieve();
            var that = this;

            this.collection.clearAll();
        
            this.collection.fetch({
                data: $.param({
                    'date': date,
                    'coords': lat + ',' + lon,
                    'size': 7,
                    'sort': 'distance'
                }),
                success: function (model) {

                    // $.each(that.resultsCollection, function (i, v) {
                    //     v.clearAll();
                    // });
                    // that.resultsCollection = {};

                    $.each(model.results, function (i, v) {
                        // that.resultsCollection = v;
                        that.collection = new SearchResult(v);
                    });
                    //Remove the initial result (its the same one!)
                    that.collection.models[0].destroy();

                    that.render();
                }
            });
        },

        render: function () {
            // this.$el.html(this.template());
            // this.$el.html(this.template(this.model.toJSON()));
            // this.$el.html(this.template(this.model.toJSON()));
            // return this;
            // var 
            var that = this;
            $.each(this.collection.models, function (i, v) {
                var reccView = new ReccView({
                    model: v
                });
                that.$el.append(reccView.render().el);
                // that.el.append(reccView.render().el)
                // console.log(reccView.render().el)
            });

            // this.el.html(this.el);
            // // return this;
            // this.$el.html(this);
            // return this;
        }

    });
    return NearbyResortsView;

});
