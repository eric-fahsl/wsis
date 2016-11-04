/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'lib/wsisConstants'

], function ($, _, Backbone, JST, wsisConstants) {
    'use strict';

    var ResortDataGraphModel = Backbone.Model.extend({
        urlBase: 'https://whereshouldiski.com/lib/resortDataSearchD3.php?resort=mountbaker&dateStart=2014-11-19&dateMax=2014-11-29&size=30',
        
        initialize: function (attributes, options) {
            
        }

    });
    return ResortDataGraphModel;
});