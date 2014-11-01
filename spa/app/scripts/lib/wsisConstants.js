'use strict';

define(
	function () {

		var constants =
		{
			months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			localUrlBase: '#search/',
			// searchApiBase: 'http://whereshouldiski.com/lib/reccapi.php?',
			searchApiBase: 'http://localhost/lib/reccapi.php?',

			convertFacetsToString: function (facets, key, value) {
	            var url = this.localUrlBase;
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
	        },

			convertDateObjToString: function (date) {
				var yyyy = date.getFullYear().toString();
				var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
				var dd  = date.getDate().toString();
				return yyyy + '-' + (mm[1] ? mm:'0' + mm[0]) + '-' + (dd[1] ? dd:'0' + dd[0]); // padding
	        },

			getTodaysDate: function () {
				return this.convertDateObjToString(new Date());
				
	        },

	        convertDateToString: function (date) {
				var time = date;
				time = time.split(' ')[0];
				time = time.split('-')[1] + '/' + time.split('-')[2] + '/' + time.split('-')[0];
				return time;
	        },

	        convertStringToDate: function (input) {
				return new Date(input.split('-').join('/'));
	        },

	        addDaysToDate: function (date, daysToAdd) {
				date.setDate(date.getDate() + daysToAdd);
				return this.convertDateObjToString(date);
	        }
			
		};
		return constants;
	}
);