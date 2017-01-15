/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Web service: Communicate with an the Amazon associates API to get best seller information using aws-lib
 * - Dialog and Session State: Handles two models, both a one-shot ask and tell model, and a multi-turn dialog model.
 *   If the user provides an incorrect slot in a one-shot model, it will direct to the dialog model
 * - Pagination: Handles paginating a list of responses to avoid overwhelming the customer.
 * - SSML: Using SSML tags to control how Alexa renders the text-to-speech.
 *
 * Examples:
 * One-shot model
 *  User:  "Alexa, ask Savvy Consumer for top books"
 *  Alexa: "Getting the best sellers for books. The top seller for books is .... Would you like
 *          to hear more?"
 *  User:  "No"
 *
 * Dialog model:
 *  User:  "Alexa, open Savvy Consumer"
 *  Alexa: "Welcome to the Savvy Consumer. For which category do you want to hear the best sellers?"
 *  User:  "books"
 *  Alexa: "Getting the best sellers for books. The top seller for books is .... Would you like
 *          to hear more?"
 *  User:  "yes"
 *  Alexa: "Second ... Third... Fourth... Would you like to hear more?"
 *  User : "no"
 */

'use strict';
var wsisHandler = require('./wsis-handler');
var alexaDateUtil = require('./alexaDateUtil');

/**
 * App ID for the skill
 */
// var APP_ID = 'amzn1.ask.skill.c785c65d-11ab-4bfc-9c9f-33eae9921852'; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]"
var APP_ID = '';

/**
 * The key to find the current index from the session attributes
 */
var KEY_CURRENT_INDEX = "current";

/**
 * The key to find the current category from the session attributes
 */
var KEY_CURRENT_CATEGORY = "category";

/**
 * The Max number of items for Alexa to read from a request to Amazon.
 */
var MAX_ITEMS = 10;

/**
 * The number of items read for each pagination request, until we reach the MAX_ITEMS
 */
var PAGINATION_SIZE = 3;

/**
 * The AWS Access Key.
 */
var AWS_ACCESS_KEY = "Your AWS Access Key";

/**
 * The AWS Secret Key
 */
var AWS_SECRET_KEY = "Your AWS Secret Key";

/**
 * The Associates Tag
 */
var AWS_ASSOCIATES_TAG = "associates_tag";

var STATE_MAPPING = {
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'British Columbia': 'BC',
    'California': 'CA',
    'Colorado': 'CO',
    'Idaho': 'ID',
    'Maine': 'ME',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Montana': 'MT',
    'Nevada': 'NE',
    'New Hampshire': 'NH',
    'New Mexico': 'NM',
    'New York': 'NY',
    'Oregon': 'OR',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Washington': 'WA',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
}

var RESORTS = {
    'Alpental': 'snoqualmie-alpental',
    'Mount Baker': 'mountbaker'
}

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * Use the aws-lib
 */
var aws = require("aws-lib");

/**
 * SavvyConsumer is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var SavvyConsumer = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SavvyConsumer.prototype = Object.create(AlexaSkill.prototype);
SavvyConsumer.prototype.constructor = SavvyConsumer;

SavvyConsumer.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("SavvyConsumer onSessionStarted requestId: " + sessionStartedRequest.requestId +
        ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

SavvyConsumer.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SavvyConsumer onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

SavvyConsumer.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("SavvyConsumer onSessionEnded requestId: " + sessionEndedRequest.requestId +
        ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

SavvyConsumer.prototype.intentHandlers = {
    "TopSellers": function (intent, session, response) {
        getTopSellers(intent, session, response);
    },

    "HearMore": function (intent, session, response) {
        getNextPageOfItems(intent, session, response);
    },

    "DontHearMore": function (intent, session, response) {
        response.tell("");
    },

    "TopResorts": function (intent, session, response) {
        getTopResorts(intent, session, response);
    },

    "DialogIntent": function (intent, session, response) {
        dialogIntent(intent, session, response);
    },

    "SupportedStatesIntent": function (intent, session, response) {
        getTopResorts(intent, session, response);
    },

    // "TopResortToday": function(intent, session, response) {
    //     getTopResortToday(intent, session, response);
    // },

    "AMAZON.HelpIntent": function (intent, session, response) {
        helpTheUser(intent, session, response);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Returns the welcome response for when a user invokes this skill.
 */
function getWelcomeResponse(response) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var speechText = "Welcome to Where Should I Ski. For when would you like to know when to ski?";
    var repromptText = "<speak>You can say <break time=\"0.1s\" />" +
        "today <break time=\"0.1s\" /> " +
        "tomorrow <break time=\"0.1s\" /> " +
        "this week <break time=\"0.1s\" /> " +
        "this weekend</speak>";

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.SSML
    };
    response.ask(speechOutput, repromptOutput);
}

function generateResponseText(data) {
    var speechText = 'I would ski at ' + data.resort_name + ' ' + data.state + ' on ' +
        alexaDateUtil.getFormattedDate(new Date(dateString)) + '. ' +
        'The powder rating is projected to be ' + data.powder + '!';

    return speechText;
}

function getFinalResponse(dateString, stateCode, response) {
    wsisHandler.getTopResortForDateAndState(dateString, stateCode, function (data) {
        var introText = '';
        if (data.powder >= 3) {
            introText = 'Looks like a powder day at ';
        } else {
            introText = 'Its not a powder day, but ';
            if (data.bluebird >= 3.5) {
                introText += 'the sun will be out at ';
            } else {
                introText += ' your best bet is '
            }
        }

        var speechText = introText +
            data.resort_name + ' ' + data.state + ' on ' +
            alexaDateUtil.getFormattedDate(new Date(dateString)) + '. ' +
            'The powder rating is projected to be ' + data.powder + ', ' +
            ' snow quality of ' + data.snow_quality + ', and a bluebird rating of ' + data.bluebird + '.';

        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };

        response.tellWithCard(speechOutput, "Where Should I Ski", speechText);
    });
}

function getFinalResponseForRange(dateStringStart, dateStringEnd, stateCode, response) {
    wsisHandler.getBestResultAcrossDatesAndState(dateStringStart, dateStringEnd, stateCode, function (data) {
        var introText = '';
        if (data.powder >= 3) {
            introText = 'Looks like a powder day at ';
        } else {
            introText = 'Its not a powder day, but ';
            if (data.bluebird >= 3.5) {
                introText += 'the sun will be out at ';
            } else {
                introText += ' your best bet is '
            }
        }

        var speechText = introText +
            data.resort_name + ' ' + data.state + ' on ' +
            alexaDateUtil.getFormattedDate(new Date(data.date)) + '. ' +
            'The powder rating is projected to be ' + data.powder + ', ' +
            ' snow quality of ' + data.snow_quality + ', and a bluebird rating of ' + data.bluebird + '.';

        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };

        response.tellWithCard(speechOutput, "Where Should I Ski", speechText);
    });
}

/**
 * Gets the top sellers from Amazon.com for the given category and responds to the user.
 */
function getTopResorts(intent, session, response) {

    var dateSlot = intent.slots.Date;
    var stateString = intent.slots.State.value;
    var stateCode = '';
    if (stateString) {
        //set up stateCode from the reference data
        stateCode = STATE_MAPPING[stateString];
    } else if (session.attributes.state) {
        //of if the state has already been set in the session
        stateCode = session.attributes.state
    }

    console.log('dateSlot', dateSlot);
    var dateString = dateSlot.value;
    var eventDate = alexaDateUtil.getDateFromSlot(dateString);
    console.log("Event Date:", eventDate);

    var dateStringStart = wsisHandler.getStringDateFormat(new Date(eventDate.startDate));
    var dateStringEnd = wsisHandler.getStringDateFormat(new Date(eventDate.endDate));
    console.log("Formatted Date start", dateStringStart);
    console.log("Formatted Date end", dateStringEnd);
    

    getFinalResponseForRange(dateStringStart, dateStringEnd, stateCode, response);

}

function dialogIntent(intent, session, response) {
   /*
    // Determine if this turn is for city, for date, or an error.
    // We could be passed slots with values, no slots, slots with no value.
    var citySlot = intent.slots.City;
    var dateSlot = intent.slots.Date;
    if (citySlot && citySlot.value) {
        handleCityDialogRequest(intent, session, response);
    } else if (dateSlot && dateSlot.value) {
        handleDateDialogRequest(intent, session, response);
    } else {
        handleNoSlotDialogRequest(intent, session, response);
    }
    */

    //Assumes we already have the state
    var stateString = intent.slots.State.value;
    var stateCode = '';
    if (stateString) {
        //set up stateCode from the reference data
        stateCode = STATE_MAPPING[stateString];
    }

    var dateString = intent.slots.Date.value;
    if (!dateString) {
        session.attributes.state = stateCode;
        //if no datestring, need to prompt for it
        var speechOutput = "For which date would you like rating information for " + stateString + "?";
        var repromptText = "For which date? You can say tomorrow, Thursday, et cetera.";

        response.ask(speechOutput, repromptText);
    } else {
        getFinalResponse(dateString, stateCode, response);
    }
    
}

/**
 * Handles the dialog step where the user has not provided a date
 */
function promptForDateRequest(intent, session, response) {



    // if we don't have a city yet, go to city. If we have a city, we perform the final request
    if (session.attributes.city) {
        getFinalTideResponse(session.attributes.city, date, response);
    } else {
        // The user provided a date out of turn. Set date in session and prompt for city
        session.attributes.date = date;
        speechOutput = "For which city would you like tide information for " + date.displayDate + "?";
        repromptText = "For which city?";

        response.ask(speechOutput, repromptText);
    }
}

/**
 * Gets the top sellers from Amazon.com for the given category and responds to the user.
 */
function getTopResortToday(intent, session, response) {

    var dateSlot = intent.slots.Date;
    console.log('dateSlot', dateSlot);
    var dateString = dateSlot.value;

    wsisHandler.getTopResortForDate(dateSlot, function (data) {
        var speechText = 'I would ski at ' + data.resort_name + ' ' + data.state + ' tomorrow. ' +
            'The powder rating is projected to be ' + data.powder + '!';

        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };

        response.tell(speechOutput);
    });
    // var speechText = 'The best resort is Whistler Blackcomb on Saturday, December 17.';

    // var speechOutput = {
    //     speech: speechText,
    //     type: AlexaSkill.speechOutputType.PLAIN_TEXT
    // };

    // response.tell(speechOutput);

}


/**
 * Instructs the user on how to interact with this skill.
 */
function helpTheUser(intent, session, response) {
    var speechText = "You can ask for the best sellers on Amazon for a given category. " +
        "For example, get best sellers for books, or you can say exit. " +
        "Now, what can I help you with?";
    var repromptText = "<speak> I'm sorry I didn't understand that. You can say things like, " +
        "books <break time=\"0.2s\" /> " +
        "movies <break time=\"0.2s\" /> " +
        "music. Or you can say exit. " +
        "Now, what can I help you with? </speak>";

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.SSML
    };
    response.ask(speechOutput, repromptOutput);

}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var savvyConsumer = new SavvyConsumer();
    savvyConsumer.execute(event, context);
};