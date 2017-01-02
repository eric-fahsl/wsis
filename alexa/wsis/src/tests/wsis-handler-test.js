var wsisHandler = require('../wsis-handler');

// wsisHander.getAllResorts();
// wsisHandler.getTopResortsForAllDates();

// wsisHandler.getTopResortForDate('2016-12-18', function(data) {
//     console.log(data);
// });


// wsisHandler.getTopResortForDate('2016-12-18', function(data) {
//         var speechText = 'I would ski at ' + data.resort_name + ' today. ' + 
//             'The powder rating is projected to be ' + data.powder + '!';

//         var speechOutput = {
//             speech: speechText,
//             type: 'AlexaSkill.speechOutputType.PLAIN_TEXT'
//         };

//         console.log(speechOutput);
// });

wsisHandler.getTopResortForTomorrow(function(data) {
    console.log(data);
});