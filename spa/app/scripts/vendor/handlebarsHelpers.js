'use strict';

define(['handlebars', 'lib/wsisConstants'],
    function (Handlebars, wsisConstants) {

        var pixelWidthSmall = 30;
        var pixelWidthWide = 60;
        var offsetIndexSmall = 24;
        var offsetIndexLarge = 30;
        //define Handlebars helper functions

        /*
        //OVERWRITE HANDLEBARS IF
        Handlebars.registerHelper('if', function(conditional, options) {
            if (Handlebars.Utils.isFunction(conditional)) { conditional = conditional.call(this); }

            // Default behavior is to render the positive path if the value is truthy and not empty.
            // The `includeZero` option may be set to treat the condtional as purely not empty based on the
            // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
            if ((!options.hash.includeZero && !conditional) || Handlebars.Utils.isEmpty(conditional) || conditional === '--') {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        });*/

        Handlebars.registerHelper('dateFormat', function(text){            
            return wsisConstants.convertDateToString(text);            
        });

        Handlebars.registerHelper('americanDateFormat', function(text){
            return wsisConstants.convertDateObjToAmericanString(text);
        });
        
        Handlebars.registerHelper('addDaysToDate', function(date, daysToAdd){
            return wsisConstants.addDaysToDate(
                wsisConstants.convertStringToDate(date), daysToAdd);
            // date.setDate(date.getDate() + daysToAdd);
            // return wsisConstants.convertDateToString(date);
        });

        Handlebars.registerHelper('calculateRatingWidth', function (ratingText, size) {
            var width = parseFloat(ratingText);
            if (size && size === 'large') 
                width *= pixelWidthWide;
            else 
                width *= pixelWidthSmall;
            return width;
        });

        Handlebars.registerHelper('calculateFreezingLevelOffset', function (rating, freezingLevel, size){
            var offsetIndex = offsetIndexSmall;
            if (size && size === 'large') 
                offsetIndex = offsetIndexLarge;

            var offset = -offsetIndex + (offsetIndex/4) * (parseFloat(rating)-1);
            return offset;
        });

        Handlebars.registerHelper('feetOrMeters', function (text){
            if (text === 'T' || text === 't') {
                return "ft";
            } else {
                return "m";
            }
        });

        Handlebars.registerHelper('displayPrecipAmount', function (inches, isDomestic) {
            if (isDomestic) {
                return inches + '"';
            } else {
                var cm = parseFloat(inches) * 2.54;
                return cm.toFixed(1) + 'cm';
            }
        });

        Handlebars.registerHelper('printDivider', function (index) {
            if( ((parseInt(index) + 1) % 6) === 0) {
                return '<div class="divider"></div>';
            } else {
                return "";
            }
        });

    }
        
);
