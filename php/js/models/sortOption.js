var app = app || {};

app.SortOption = App.Facet.extend({

    initialize: function(attributes, options) {
        this.model = attributes;

        var facets = {};
        if (options) {
            facets = options.collection.facets;
            this.facetType = options.collection.facetType;
        }
        var termValue = "";
        if (this.attributes.term) {
            termValue = this.attributes.term;
            this.set({displayValue: termValue});
            if (termValue.substring(0,3) == '201') {
                var date = new Date(termValue);
                var displayValue = this.days[date.getUTCDay()] + ' ' + (date.getUTCMonth() + 1) + '/' +
                    date.getUTCDate() + '/' + date.getUTCFullYear().toString().substring(2);
                this.set({displayValue: displayValue });
            }
        }

        //For Distance Facets
        if (this.attributes.to) {
            var distance = this.attributes.to;
            this.set({term: distance});
            this.set({displayValue: "Under " + distance + " Miles"});
        }

        //Set the destination URL
        this.set({url: this.convertFacetsToString(facets, this.facetType, this.attributes.term)});
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