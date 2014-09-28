/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/dateModel'

], function ($, _, Backbone, JST, DateModel) {
    'use strict';

    var DateList = Backbone.Collection.extend({

	    // Reference to this collection's model.
	    model: DateModel,

	    clearAll: function () {
	        //_.each(this.models, function (model){ model.destroy(); });
	        while (this.models.length) {
	            this.models[0].destroy();
	        }
	    }
	});
	return DateList;
});
