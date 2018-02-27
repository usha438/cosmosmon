const logger = require('../_log/logger_def.js');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const ObjectId = mongoose.Types.ObjectId;
const Conversation = require('../models/conversationModel');
const Bot = require('../models/botModel');

exports.calculateMetrics = function(req, res){

  performAggregation(req.params.bot_id, 9).then((aggregationResult) =>{
    aggregationResult = aggregationResult[0];
    aggregationResult.array_lastNineDays = [];
    aggregationResult.array_lastNineDaysConversations = [];
    // aggregationResult.array_lastNineDaysUsers = [];
    aggregationResult.lastNineDays.forEach((day)=>{
      aggregationResult.array_lastNineDays.push(day.date);
      aggregationResult.array_lastNineDaysConversations.push(day.conversations);
      // aggregationResult.array_lastNineDaysUsers.push(day.date);
    })

    res.status(200).send(aggregationResult);
  }).catch((err)=>{
    logger.error("Error aggregating the data : " + err);
    res.status(500).send("Error aggregating the data")
  })

}

function performAggregation(bot_id, days){
  var today = new Date();
  var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);

  var lastNineConvoPipe = [
    {
      $match: {
        createdAt: {$gt: new Date(lastWeek)}
      }
    },
    {
      $group: {
        _id:  {
          year: {$year: "$createdAt"},
          month: {$month: "$createdAt"},
          day: {$dayOfMonth: "$createdAt"}
        },
        count: {$sum: 1}
      }
    },
    {$project:
      {
        count: 1
      }
    }
  ];

  var uniqueUsersPipe = [
    {$group: {
      _id: '$user.id',
      count: {$sum: 1}
    }},
    {$project:{
      _id: 0,
      tag:'$_id', count:'$count'
    }},
    {$group: {
      _id: { $lt: [ "$count", 2 ] },
      count: {$sum: 1}
    }},
    {$project:{
      _id: 0,
      newUsers:'$_id', count:'$count'
    }}
  ];

  var lastNineDaysPipe = [
    {
      $match: {
        createdAt: {$gt: new Date(lastWeek)}
      }
    },
    {
      $group: {
        _id:  {
          year: {$year: "$createdAt"},
          month: {$month: "$createdAt"},
          day: {$dayOfMonth: "$createdAt"},
          dayofWeek: {$dayOfWeek: "$createdAt"}
        },
        usersPerDay: {$addToSet: "$user.id"},
        count: {$sum: 1}
      }
    },
    { $sort : { _id : 1} },
    {
      $project:{
        _id: 0,
        dayofWeek:'$_id.dayofWeek',
        conversations:'$count',
        date: {
          $concat: [
            { $substr: [ '$_id.month', 0, 4 ] },
            "/",
            { $substr: [ '$_id.day', 0, 4 ] },
            "/",
            { $substr: [ '$_id.year', 0, 4 ] }
          ]
        },
        users: '$usersPerDay'
      }
    }
  ]

  return Conversation.aggregate(
    {
      $match:{ owner: ObjectId(bot_id) }
    },
    {
      $facet: {
        // "convoLastNineDays" : lastNineConvoPipe,
        "uniqueUsers" : uniqueUsersPipe,
        "lastNineDays" : lastNineDaysPipe
      }
    });




}
