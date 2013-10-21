var app = app || {};

app.DateModel = Backbone.Model.extend({

    months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days: ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    initialize: function(){
        var date = new Date(this.get("date") + " GMT-1100");
        var prettyDate = this.days[date.getDay()] + ', ' + this.months[date.getMonth()] + ' '
            + date.getDate();
        this.set({prettyDate: prettyDate});
    }


});