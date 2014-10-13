'use strict';

define(['handlebars'],
    function (Handlebars) {

        //define Handlebars helper functions

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
        });
        Handlebars.registerHelper('dateFormat', function(text){
            if(text && (text.indexOf('--') < 0)){
                var time = text;
                time = time.split(' ')[0];
                time = time.split('-')[1] + '/' + time.split('-')[2] + '/' + time.split('-')[0];
                return time;
            }else{
                return ' -- ';
            }
        });
        
    }
);
