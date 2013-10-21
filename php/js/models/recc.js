// js/models/recc.js

var app = app || {};

// Todo Model
// ----------
// Our **Recc** model has all of the fields int he recommendation model

app.Recc = Backbone.Model.extend({
    days: ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    initialize: function() {
        var termValue = "";
        if (this.attributes.term) {
            termValue = this.attributes.term;
            this.set({displayValue: termValue});
            if (termValue.substring(0,3) == '201') {
                var date = new Date(termValue + " GMT-1100");
                var displayValue = this.days[date.getDay()] + ' ' + (date.getMonth() + 1) + '/' +
                    date.getDate() + '/' + date.getFullYear().toString().substring(2);
                this.set({displayValue: displayValue });
            }
        }

        //For Distance Facets
        if (this.attributes.to) {
            var distance = this.attributes.to;
            this.set({term: distance});
            this.set({displayValue: "Under " + distance + " Miles"});
        }
    }
});