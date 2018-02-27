const Bot = require('../models/botModel');
const Conversation = require('../models/conversationModel');
const logger = require('../_log/logger_def.js');
const _ = require('lodash');
var async = require('async');
var moment = require('moment');

//updating the new conversation array in bot
var updateNewConversationArray = function(bot_id, data, callback1) {
  Bot.findByIdAndUpdate(bot_id, data, {
      'new': true
    })
    .then((singleBot) => {
      logger.info("Updated bot with _id: " + singleBot._id);
      callback1({
        "result": "success"
      });
    })
    .catch((err) => {
      logger.error("Error finding a bot with that ID. " + err);
      callback1({
        "result": "error"
      });
    });
};

//function to update the flag ended to true and get the new conversation array
var setTheFlagEndedToTrue = module.exports = function(convo_array, bot_id, timeLimit, callback1) {
  logger.info("Archiving conversations for bot : " + bot_id);
  var count = 0;
  var total = convo_array.length;
  async.each(convo_array, function(convo, callback) {
    console.log(convo);
    var duration = moment.duration(moment(new Date(), "DD/MM/YYYY HH:mm:ss").diff(new Date(convo.updatedAt)));
    console.log(duration.asHours()); //prints NaN
    if (duration.asHours() > timeLimit) {
      count++
      Conversation.findByIdAndUpdate(convo._id, {
          "ended": true
        }, {
          'new': true
        })
        .then((singleConvo) => {
          logger.info("Updated conversation with _id: " + singleConvo._id);
          var index = -1;
          var val = singleConvo._id.toString();
          var index = convo_array.findIndex(function(item, i) {
            return item._id == val
          });
          (convo_array).splice(index, 1);
          if ((count + convo_array.length) == total) {
            updateNewConversationArray(bot_id, {
              "conversations": convo_array
            }, callback1);
          };
        })
        .catch((err) => {
          logger.error("Error finding a conversation with that ID. " + err);
          callback1({
            "result": "error"
          });
        });
    };
  });
};


//code for finding the bot which is having the old conversation ids

var getTheOldConversationIds = function(bot_id, timeLimit, callback1) {
  Bot.findById(bot_id)
    .populate('conversations', 'conversationID createdAt updatedAt')
    .then((singleBot) => {
      //call another function
      setTheFlagEndedToTrue(singleBot.conversations, bot_id, timeLimit, callback1);
    })
    .catch((err) => {
      logger.error(err);
      callback1({
        "result": err
      });
    });
};

//call the the function to get the old conversation Ids
// getTheOldConversationIds("5a74b8be3a177e2524068040", 0, function(response) {
//   if (response.result == "success") {
//     logger.info("set the conversation ended flag to true and updated the bot array with new IDs");
//     console.log('success');
//   } else {
//     logger.error("Error " + err);
//     console.log(response.result);
//   }
// });
//(uncomment the above code when testing archieve functionality)
