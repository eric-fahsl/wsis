  //target format: 2015-05-18T09:03:25.877Z
  //actual format: 11/Apr/2016:13:00:07 -0700

  var input = "11/Apr/2016:13:00:07";

var MONTH_STR_TO_INT = {
	'Jan': 1,
	'Feb': 2,
	'Mar': 3,
	'Apr': 4,
	'May': 5,
	'Jun': 6,
	'Jul': 7,
	'Aug': 8,
	'Sep': 9,
	'Oct': 10,
	'Nov': 11,
	'Dec': 12
}

  var convertToEsTime = function(input) {  	
  	var inputSplit = input.split(':');
  	var dateStr = inputSplit[0];
  	dateStrSplit = dateStr.split('/');

  	var output = dateStrSplit[2] + '-';
  	output += ('0' + MONTH_STR_TO_INT[dateStrSplit[1]]).slice(-2) + '-' + dateStrSplit[0];

  	output += 'T' + inputSplit[1] + ':' + inputSplit[2] + ':' + inputSplit[3] + 'Z';
  	return output;
  }

console.log(input);
  console.log(convertToEsTime(input));