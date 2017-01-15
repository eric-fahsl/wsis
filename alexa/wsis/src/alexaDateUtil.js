/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * Provides date and time utilities to format responses in
 * a manner appropriate for speech output.
 */
var alexaDateUtil = (function () {

    var DAYS_OF_MONTH = [
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th',
        '7th',
        '8th',
        '9th',
        '10th',
        '11th',
        '12th',
        '13th',
        '14th',
        '15th',
        '16th',
        '17th',
        '18th',
        '19th',
        '20th',
        '21st',
        '22nd',
        '23rd',
        '24th',
        '25th',
        '26th',
        '27th',
        '28th',
        '29th',
        '30th',
        '31st'
    ];

    var DAYS_OF_WEEK = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    var MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    // Used to work out the dates given week numbers
    var w2date = function (year, wn, dayNb) {
        var day = 86400000;

        var j10 = new Date(year, 0, 10, 12, 0, 0),
            j4 = new Date(year, 0, 4, 12, 0, 0),
            mon1 = j4.getTime() - j10.getDay() * day;
        return new Date(mon1 + ((wn - 1) * 7 + dayNb) * day);
    };

    // Given a week number return the dates for both weekend days
    var getWeekendData = function (res) {
        if (res.length === 3) {
            var saturdayIndex = 5;
            var sundayIndex = 6;
            var weekNumber = res[1].substring(1);

            var weekStart = w2date(res[0], weekNumber, saturdayIndex);
            var weekEnd = w2date(res[0], weekNumber, sundayIndex + 1); //+1 To account for "less than""

            return Dates = {
                startDate: weekStart,
                endDate: weekEnd,
            };
        }
    }

    // Given a week number return the dates for both the start date and the end date
    var getWeekData = function (res) {
        if (res.length === 2) {

            var mondayIndex = 0;
            var sundayIndex = 6;

            var weekNumber = res[1].substring(1);

            var weekStart = w2date(res[0], weekNumber, mondayIndex);
            var weekEnd = w2date(res[0], weekNumber, sundayIndex + 1); //+1 To account for "less than""

            return Dates = {
                startDate: weekStart,
                endDate: weekEnd,
            };
        }
    }


    return {

        /**
         * Returns a speech formatted date, without the time. If the year
         * is the same as current year, it is omitted.
         * Example: 'Friday June 12th', '6/5/2016'
         */
        getFormattedDate: function (date) {
            var today = new Date();

            if (today.getFullYear() === date.getFullYear()) {
                return DAYS_OF_WEEK[date.getDay()] + ' ' + MONTHS[date.getMonth()] + ' ' + DAYS_OF_MONTH[date.getDate() - 1];
            } else {
                return DAYS_OF_WEEK[date.getDay()] + ' ' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            }
        },

        /**
         * Returns a speech formatted time, without a date, based on a period in the day. E.g.
         * '12:35 in the afternoon'
         */
        getFormattedTime: function (date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();

            var periodOfDay;
            if (hours < 12) {
                periodOfDay = ' in the morning';
            } else if (hours < 17) {
                periodOfDay = ' in the afternoon';
            } else if (hours < 20) {
                periodOfDay = ' in the evening';
            } else {
                periodOfDay = ' at night';
            }

            hours = hours % 12;
            hours = hours ? hours : 12; // handle midnight
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var formattedTime = hours + ':' + minutes + periodOfDay;
            return formattedTime;
        },

        /**
         * Returns a speech formatted, without a date, based on am/rpm E.g.
         * '12:35 pm'
         */
        getFormattedTimeAmPm: function (date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';

            hours = hours % 12;
            hours = hours ? hours : 12; // handle midnight
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var formattedTime = hours + ':' + minutes + ' ' + ampm;
            return formattedTime;
        },

        // Given an AMAZON.DATE slot value parse out to usable JavaScript Date object
        // Utterances that map to the weekend for a specific week (such as �this weekend�) convert to a date indicating the week number and weekend: 2015-W49-WE.
        // Utterances that map to a month, but not a specific day (such as �next month�, or �December�) convert to a date with just the year and month: 2015-12.
        // Utterances that map to a year (such as �next year�) convert to a date containing just the year: 2016.
        // Utterances that map to a decade convert to a date indicating the decade: 201X.
        // Utterances that map to a season (such as �next winter�) convert to a date with the year and a season indicator: winter: WI, spring: SP, summer: SU, fall: FA)
        getDateFromSlot: function (rawDate) {
            // try to parse data
            var date = new Date(Date.parse(rawDate));
            var result;
            // create an empty object to use later
            var eventDate = {

            };

            // if could not parse data must be one of the other formats
            if (isNaN(date)) {
                // to find out what type of date this is, we can split it and count how many parts we have see comments above.
                var res = rawDate.split("-");
                // if we have 2 bits that include a 'W' week number
                if (res.length === 2 && res[1].indexOf('W') > -1) {
                    var dates = getWeekData(res);
                    eventDate["startDate"] = new Date(dates.startDate);
                    eventDate["endDate"] = new Date(dates.endDate);
                    // if we have 3 bits, we could either have a valid date (which would have parsed already) or a weekend
                } else if (res.length === 3) {
                    var dates = getWeekendData(res);
                    eventDate["startDate"] = new Date(dates.startDate);
                    eventDate["endDate"] = new Date(dates.endDate);
                    // anything else would be out of range for this skill
                } else {
                    eventDate["error"] = dateOutOfRange;
                }
                // original slot value was parsed correctly
            } else {
                eventDate["startDate"] = new Date(date).setUTCHours(0, 0, 0, 0);
                eventDate["endDate"] = new Date(date).setUTCHours(24, 0, 0, 0);
            }
            return eventDate;
        }


    };
})();
module.exports = alexaDateUtil;