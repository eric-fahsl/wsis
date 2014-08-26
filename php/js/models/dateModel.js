var app = app || {};

app.DateModel = Backbone.Model.extend({
    urlBase: "#search/",
    months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days: ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    initialize: function(attributes, options){
        var facets = {};
        if (options) {
            facets = options;
        }

        var date = new Date(this.get("date").split("-").join("/"));

        var prettyDate = this.days[date.getUTCDay()] + ', ' + this.months[date.getUTCMonth()] + ' '
            + date.getUTCDate();
        this.set({prettyDate: prettyDate});

        //Set the destination URL
        this.set({url: this.convertFacetsToString(facets, "date", this.get("date"))});
    },

    convertFacetsToString: function(facets, key, value) {
        var url = this.urlBase;
        var showFacet = true;
        for (var k in facets) {
            if (facets[k] != value)
                url += k + "=" + facets[k] + "&";
            else
                showFacet = false;
        }
        if (showFacet)
            url += key + "=" + value;
        if (url[url.length-1] == '&')
            url = url.substr(0, url.length-1);
        return url;
    }

});