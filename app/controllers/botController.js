const logger = require('../_log/logger_def.js');
const _ = require('lodash');
const crypto = require('crypto');
const authcontroller = require('./authController');
const mongoose = require('mongoose');
const Bot = require('../models/botModel');
//const Conversation = require('../models/conversationModel');
var async = require('async');
mongoose.Promise = require('bluebird');
const Joi = require('joi');
// var Promise = require('bluebird');
// Promise.promisifyAll(mongoose);

const bot_joiSchema = {
	name: Joi.string().required(),
	org: Joi.string().required(),
	framework: Joi.string().required(),
	description: Joi.string()
};

//bot controller
//get all Bots
exports.list = function(req, res){
	Bot.find({})
	.then((allBots)=>{
		res.status(200).send(allBots);
	})
	.catch((err)=>{
		logger.error(err.message);
		res.status(500).send(err);
	})
};

//find bot by cutom key-val pair
exports.find = function(req, res){
	var query = {};
	query[req.params.key] = req.params.value;
	Bot.findOne(query)
	.populate('conversations','channel conversationID user createdAt updatedAt totalMessages')
	.then((singleBot)=>{
		if(singleBot){
			res.status(200).send(singleBot);
		}else{
			logger.error("Could not find bot with that ID.");
			res.status(404).send({"message":"Could not find bot with that ID."});
		}
	})
	.catch((err)=>{
		logger.error(err);
		res.status(500).send({"message":"Could not find bot with that ID."});
	});
};

//get one bot by ID
exports.getBotById = function(req, res, next){
	Bot.findById(req.params.bot_id)
	.populate('conversations','channel conversationID user createdAt updatedAt totalMessages totalMessages')
	.then((singleBot)=>{
		if(singleBot){
			res.status(200).send(singleBot);
		}else{
			logger.error("Could not find bot with that ID.");
			res.status(404).send({"message":"Could not find bot with that ID."});
		}
	})
	.catch((err)=>{
		logger.error(err);
		res.status(500).send({"message":"Could not find bot with that ID."});
	});
};

//Create a bot
exports.create = function(req, res){
	Joi.validate(req.body, bot_joiSchema)
	//if JoI validates
	.then((validObj)=>{
		validObj.referenceID = crypto.randomBytes(16).toString('hex');
		var newBot = new Bot(validObj);
		newBot.save()
		.then((newBotObj)=>{
			newBotObj = newBotObj.toObject();
			logger.info("New bot created. _id: "+newBotObj._id);
			authcontroller.createToken(newBotObj)
			.then(function(token){
				newBotObj.token = token;
				res.status(200).send(newBotObj);
			});
		})
		.catch((err)=>{
			logger.error(err.message);
			res.status(500).send(err);
		});
	})
	.catch((err)=>{
		logger.error(err.message);
		res.status(500).send(err);
	});

};

//Update bot by ID
exports.update = function(req, res){
	var data = req.body;
	exports.updateBot(req.params.bot_id, data)
	.then((singleBot)=>{
		logger.info("Updated bot with _id: "+ singleBot._id + " Updated fields: " + Object.keys(data));
		res.status(200).send(singleBot);
	})
	.catch((err)=>{
		logger.error("Error finding a bot with that ID.  " + err);
		res.status(404).send({"message":"Could not find bot with that ID."});
	});

};

//Delete bot by ID
exports.remove = function(req, res){
	Bot.deleteOne({"_id" : req.params.bot_id})
	.then((del)=>{
		logger.info("Deleted bot with _id: "+ req.params.bot_id);
		res.status(200).send(del);
	})
	.catch((err)=>{
		logger.error("Error in Deleting bot with _id: "+ req.params.bot_id);
		res.status(404).send({"message":"Could not find bot with that ID."});
	});
};

//get the unique and recurring users of a bot
exports.countOfUsers = function(req, res) {
	Bot.findById(req.query.bot_id)
	.populate('conversations', 'user')
	.then((singleBot) => {
		console.log(singleBot);
		var count = 0;
		var newUsers = 0;
		var recurringUsers = 0;
		var array = [];
		async.each(singleBot.conversations, function(eachuser, callback) {
			console.log(eachuser)
			count++
			if (array.indexOf(eachuser.user[0].name) === -1) {
				newUsers++;
				array.push(eachuser.user[0].name);
				if (singleBot.conversations.length == array.length) {
					logger.info("got count of users for Bot Id " + req.query.bot_id);
					res.status(200).send({
						"new users": newUsers,
						"recurring users": recurringUsers
					});
				}
			} else {
				array.push(eachuser.user[0].name);
				newUsers = newUsers-1;
				recurringUsers++;
				if (singleBot.conversations.length == array.length) {
					logger.info("got count of users for Bot Id " + req.query.bot_id);
					res.status(200).send({
						"new users": newUsers,
						"recurring users": recurringUsers
					});
				}
			}
		}, function(err) {
			console.log('something went wrong with async function');
			logger.error(err);
			res.status(200).send({
				"result": "there are no conversation Ids"
			});
		});
	})
	.catch((err) => {
		logger.error(err.message);
		res.status(404).send(err);
	});
};


exports.getCustomSettings = function(req, res){
	Bot.findById(req.authdata._id)
	.then((singleBot) => {
		if(singleBot){
			var result = {};
			for (var i=0; i<singleBot.customSettings.length; i++) {
				result[singleBot.customSettings[i].key] = singleBot.customSettings[i].value;
			}
			res.status(200).send(result)
		}
		else{
			logger.error("Could not find bot with that ID.");
			res.status(404).send({"message":"Could not find bot with that ID."});
		}
	})
	.catch((err)=>{
		// logger.error("Error finding a bot with that ID.  " + err);
		res.status(404).send({"message":"Could not find bot with that ID."});
	});
}


//helpers
//General use updateBot functionality
exports.updateBot = function(id, data){
	return Bot.findByIdAndUpdate(id, data, {'new':true})
}

//countOfUsers("5a74b8be3a177e2524068040");
