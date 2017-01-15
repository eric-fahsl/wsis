var request = require('request');

var BASE_URL = 'https://whereshouldiski.com/lib/reccapi.php';


function retrieveData(inputUrl, callback) {
    console.log('retrieveData url', inputUrl);
    var options = {
        url: inputUrl,
        headers: {
            'User-Agent': 'wsis-handler-lambda'
        }
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body); 
            // console.log('complete');
            // console.log('retrieveData received Body', body);
            callback(JSON.parse(body));
        }
    });
}

function printResponseData(body) {
    console.log(body);
}

function getTopResortsPerDateCallback(data) {
    var topResults = getBestResultPerDate(data);
    console.log(topResults);
}

function multipleDateHandler(data, callback) {
    var bestResults = getBestResultPerDate(data);
    var bestResult = {
        powder: 0,
        bluebird: 0,
        snow_quality: 0
    }
    for (var i in bestResults) {
        var currentResult = bestResults[i];
        //if the result is better than the current bestResult, use it.
        if (currentResult.powder > bestResult.powder) {
            bestResult = currentResult;
            // return bestResult;
        } else if (currentResult.powder === bestResult.powder && currentResult.snow_quality > bestResult.snow_quality) {
            bestResult = currentResult;
        } else if (currentResult.powder === bestResult.powder && currentResult.snow_quality === bestResult.snow_quality &&
            currentResult.bluebird > bestResult.bluebird)
            bestResult = currentResult;
    }

    callback(bestResult);
}

module.exports.getBestResultAcrossDatesAndState = function (startDateString, endDateString, state, callback) {
    if (!state) {
        retrieveData(BASE_URL + '?dateStart=' + startDateString + '&dateMax=' + endDateString, function (data) {
            multipleDateHandler(data, callback);
        });
    } else {
        retrieveData(BASE_URL + '?dateStart=' + startDateString + '&dateMax=' + endDateString + 
            '&state=' + state, function (data) {
            multipleDateHandler(data, callback);
        });
    }
    
    
}

module.exports.getBestResultAcrossDates = function (startDateString, endDateString, callback) {
    retrieveData(BASE_URL + '?dateStart=' + startDateString + '&dateMax=' + endDateString, function (data) {
        multipleDateHandler(data, callback);       
    });
}

function getBestResultPerDate(responseObject) {
    var bestResults = [];
    // console.log(responseObject.results);
    for (var date in responseObject.results) {
        // console.log('date',date);
        var reccs = responseObject.results[date];
        // console.log('reccs',reccs);
        bestResults.push(extractAlexaFriendlyData(reccs[0]));
    }
    return bestResults;
}

function extractAlexaFriendlyData(reccObject) {
    // console.log(reccObject);
    var result = {
        resort_name: reccObject._source.resort_name,
        state: reccObject._source.state_full,
        date: reccObject._source.date,
        powder: reccObject._source.powder.rating,
        bluebird: reccObject._source.bluebird.rating,
        snow_quality: reccObject._source.snow_quality.rating
    }
    return result;
}

module.exports.getAllResorts = function () {
    retrieveData(BASE_URL, printResponseData);
}

module.exports.getTopResortsForAllDates = function () {
    retrieveData(BASE_URL, getTopResortsPerDateCallback);
}

function getTopResortForDate(dateString, callback) {

    retrieveData(BASE_URL + '?date=' + dateString, function (data) {
        // console.log('retrieveData', data);
        var bestResults = getBestResultPerDate(data);
        // var minimalData = extractAlexaFriendlyData(bestResults[0]);
        // console.log(bestResults[0]);
        callback(bestResults[0]);
    });
}

function getTopResortForDateAndState(dateString, state, callback) {

    retrieveData(BASE_URL + '?date=' + dateString + '&state=' + state, function (data) {
        // console.log('retrieveData', data);
        var bestResults = getBestResultPerDate(data);
        // var minimalData = extractAlexaFriendlyData(bestResults[0]);
        // console.log(bestResults[0]);
        callback(bestResults[0]);
    });
}

module.exports.getStringDateFormat = function (date, daysOffset) {
    if (!daysOffset) {
        daysOffset = 0;
    }
    date.setDate(date.getDate() + daysOffset);
    var response = date.getFullYear() + '-' +
        addLeadingZero(date.getMonth() + 1) + '-' +
        addLeadingZero(date.getDate());
    return response;
}

function addLeadingZero(input) {
    if (input < 10) {
        return '0' + input;
    }
    return input;
}

module.exports.getTopResortForDate = function (dateString, callback) {
    getTopResortForDate(dateString, callback);
}

module.exports.getTopResortForDateAndState = function (dateString, state, callback) {
    if (!state) {
        getTopResortForDate(dateString, callback);
    } else {
        getTopResortForDateAndState(dateString, state, callback);
    }
}

module.exports.getTopResortForToday = function (callback) {
    var dateString = getStringDateFormat(new Date());
    getTopResortForDate(dateString, callback);
}

module.exports.getTopResortForTomorrow = function (callback) {
    var dateString = getStringDateFormat(new Date(), 1);
    // console.log('dateString', dateString);
    getTopResortForDate(dateString, callback);
    // getTopResortForDate('2016-12-19', callback);
}