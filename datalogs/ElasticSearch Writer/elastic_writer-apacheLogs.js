var _ = require('underscore');

var fs = require('fs');

//all the log files
var readPath = 'all-logs.log';

//just one file of log files
// var readPath = 'access.log';

var readStream = fs.createReadStream(readPath, {flags: 'r', encoding: 'utf-8'});
var elasticsearch = require('elasticsearch');
var buf = '';

readStream.on('data', function(d) {
    buf += d.toString(); // when data is read, stash it in a string buffer
    pump(); // then process the buffer
});

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
  requestTimeout: 600000
});

var logStringToArr = function(logString) {

  var logStringArr = logString.split(' ');
  var newArr = [];

  //IP
  newArr.push(logStringArr[0]);
  //TimeStamp
  //newArr.push(cleanseString(logStringArr[3] + logStringArr[4]));
  newArr.push(convertToEsTime(cleanseString(logStringArr[3])));

  //target format: 2015-05-18T09:03:25.877Z
  //actual format: 11/Apr/2016:13:00:07 -0700

  //Request Type
  newArr.push(logStringArr[5]);
  //URL
  newArr.push(cleanseString(logStringArr[6]));
 
  //Compile UserAgent String
  var userAgentStr = '';
  for (var i = 11; i < logStringArr.length; i++) {
    userAgentStr += ' ' + logStringArr[i];
  }
  userAgentStr = cleanseString(userAgentStr);
  newArr.push(userAgentStr);

  //Browser
  //newArr.push(logStringArr[22]);
  //newArr.push(logStringArr[23]);
  
  return newArr;
}

var cleanseString = function(input) {
  return input.replace('"','')
    .replace('[','')
    .replace(']','')
    .replace('%2C',',')
    .trim();
}

var arrToObj = function(arr) {
  var objectMapping = ['ip', '@timestamp', 'type', 'url', 'userAgent']
  return _.object(objectMapping, arr);
}

var fields = ['coords', 'distance', 'powder', 'region', 'state', 'date', 'resort'];
parseURLFields = function(url) {
  var urlFields = {};
  for (var i in fields) {
    var field = fields[i];
    var fieldPosition = url.indexOf(field);;
    if (fieldPosition > 0) {
      //first calculate the end index of the substring
      var endIndex = url.indexOf('&', fieldPosition);
      if (endIndex < 0) {
        endIndex = url.length;
      }
      
      //now grab the substring for just the field/value then split it by the equals sign
      var fieldValue = url.substr(fieldPosition, endIndex).split('&')[0].split('=')[1];
      urlFields[field] = fieldValue;
      
    }
  }
  return urlFields;
}

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

function pump() {
    var pos;
    while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
        if (pos == 0) { // if there's more than one newline in a row, the buffer will now start with a newline
            buf = buf.slice(1); // discard it
            continue; // so that the next iteration will start with data
        }
        processLine(buf.slice(0,pos)); // hand off the line
        buf = buf.slice(pos+1); // and slice the processed data off the buffer
    }
}


function processLine(line) { // here's where we do something with a line

    if (line[line.length-1] == '\r') line=line.substr(0,line.length-1); // discard CR (0x0D)

    if (line.length > 0 && line.indexOf('reccapi.php') > 0) { // ignore empty lines AND non-API calls

        var obj = arrToObj(logStringToArr(line));
        obj.searchFields = parseURLFields(obj.url);
        // console.log(output);

        client.create({
          index: 'apachelogs',
          type: 'log',
          body: obj
        }, function (error, response) {
          if (error) {
            console.log('elasticsearch error: ' + error);
          }            
        });
    
    }
}



