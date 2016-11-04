'use strict';

define(
	function () {

		var constants =
		{
			months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			localUrlBase: '#search/',
			menuOptions: ['about', 'recommendations', 'resorts', 'feedback'],
			searchApiBase: 'https://whereshouldiski.com/lib/reccapi.php?',
			resortDataD3UrlBase: 'https://whereshouldiski.com/lib/resortDataSearchD3.php?size=7&sortDate=T',
			// searchApiBase: 'http://localhost/lib/reccapi.php?',

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
				var time = date.split('-');
				// time = time.split(' ')[0];
				return time[1] + '/' + time[2] + '/' + time[0];
	        },

	        convertDateObjToAmericanString: function (date) {
				var time = date.split('-');
				// time = time.split(' ')[0];
				return this.months[parseInt(time[1]) - 1] + ' ' + time[2] + ', ' + time[0];
	        },

	        convertDateToPrettyString: function (strDate) {
				var date = this.convertStringToDate(strDate);
				return this.days[date.getUTCDay()] + ', ' + this.months[date.getUTCMonth()] + ' ' + date.getUTCDate();
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