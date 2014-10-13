/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/reccDetailModel'

], function ($, _, Backbone, JST, Recommendation) {
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
            this.model.fetch();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON({})));
        }

    });
    return ReccDetailsView;

});
