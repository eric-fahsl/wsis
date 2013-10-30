var app = app || {};

app.SortOption = app.Facet.extend({

    selected: "",

    initialize: function(attributes, options) {

        var facets = {};
        if (options) {
            facets = options;
            if (facets.sort && facets.sort == attributes.i)
                selected = "selected";
        }
        this.attributes = attributes;

        //Set the destination URL
        this.set({url: this.convertFacetsToString(facets, "sort", this.attributes.sort)});
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