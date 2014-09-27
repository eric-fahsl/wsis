/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/recc'

], function ($, _, Backbone, JST, Recc) {
    'use strict';

    var ReccList = Backbone.Collection.extend({

	    // Reference to this collection's model.
	    model: Recc,

	    clearAll: function() {
	//        _.each(this.models, function(model){ model.destroy(); });
	        while (this.models.length) {
	            this.models[0].destroy();
	        }
	    }

	});
	return ReccList;
});
