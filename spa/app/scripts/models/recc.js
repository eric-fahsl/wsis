/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'

], function ($, _, Backbone, JST) {
    'use strict';

    var Recc = Backbone.Model.extend({

	    initialize: function(attributes) {
	        if (attributes.fields && attributes.fields['freezing_level.rating']) {
	            //set the Freezing level offset
	            var offset = -24 + (24/4) * (attributes.fields['freezing_level.rating']-1);
	            attributes.fields['freezing_level.offset'] = offset;
	        }
	        this.model = attributes;
	    }

	});

	return Recc;
});