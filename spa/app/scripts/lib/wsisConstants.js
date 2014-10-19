'use strict';

define(
	function () {

		var constants =
		{
			months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			urlBase: '#search/',

			convertFacetsToString: function (facets, key, value) {
	            var url = this.urlBase;
	            var showFacet = true;
	            for (var k in facets) {
	                if (facets[k] !== String(value))
	                    url += k + '=' + facets[k] + '&';
	                else
	                    showFacet = false;
	            }
	            if (showFacet)
	                url += key + '=' + value;
	            if (url[url.length - 1] === '&')
	                url = url.substr(0, url.length - 1);
	            return url;
	        }
			
		};
		return constants;
	}
);