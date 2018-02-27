const logger = require('../_log/logger_def.js');
const _ = require('lodash');
var mongoose = require('mongoose');
const Conversation = require('../models/conversationModel');
const Bot = require('../models/botModel');
const archive = require('./archiveController');
mongoose.Promise = require('bluebird');
//conversation controller

//get the conersation details
exports.list = function(req, res){
	Conversation.find({})
	.then((allconvos)=>{
		res.status(200).send(allconvos);
	})
	.catch((err)=>{
		logger.error(err.message);
		res.status(500).send(err);
	})
};

//create the converastion details
//MOSTLY NOT USABLE FOR US
exports.create = function(req, res){
	var newconvo = new Conversation(req.body);
	newconvo.save()
	.then((newConvoObj)=>{
		logger.info("New conversation created. _id: "+newConvoObj._id);
		res.status(200).send(newConvoObj);
	})
	.catch((err)=>{
		logger.error(err.message);
		res.status(500).send(err);
	});
};

//create new conversation or update if one already present.
//if created new, update the bot with its ID.
exports.createOrUpdate = function(req, res){
	console.log(req.body);
	Conversation.findOne({conversationID: req.body.conversationID})
	.then((doc)=>{
		if(!doc){ //if convo doesn't exist, create new.
		var newConversation = createConversationObject(req.body, req.authdata);
		newConversation.save()
		.then((newConvoObj)=>{
			logger.info("New conversation started. _id: "+newConvoObj._id);
			Bot.update(
				{_id : req.authdata._id},
				{ $push: {conversations: newConvoObj._id}},
				(err, doc) => {
					if(err){
						logger.error('Error registering new conversation into the bot. Bot._id: '+req.authdata._id)
						logger.error(err);
						res.sendStatus(500);
					}else{
						res.sendStatus(200);
					}
				}
			)
		})
		.catch((err)=>{
			logger.error(err.message);
			res.status(500).send(err);
		});
	}else{ //if exists, add new message.
		console.log("doc found, updating");
		Conversation.update(
			{_id:doc._id},
			{
				$push : {messages: req.body},
				$inc: { "totalMessages": 1 }
			},
			(err, docu)=>{
				if(err){
					logger.error('Error updating document. _id: ' + doc._id + "\nErr: " + err)
					console.log(err);
				}else{
					res.sendStatus(200);
				}
			}
		)
	}
})
.catch((err)=>{
	logger.error(err);
	res.sendStatus(500);
})
}

//remove the conversation - by ID
exports.remove = function(req, res){
	console.log(req.params.conv_id);
	Conversation.findOneAndRemove({"_id" : req.params.conv_id})
	.then((del)=>{
		Bot.findByIdAndUpdate({ _id: del.owner }, { $pull: { conversations: { $in: [req.params.conv_id] } } },{'new':true})
		.populate('conversations','channel conversationID user createdAt updatedAt')
		.then((singleBot) => {
			logger.info("Updated bot with _id: " + singleBot._id);
			res.status(200).send(singleBot);
		})
		.catch((err) => {
			logger.error("Error finding a bot with that ID. " + err);
			res.status(404).send(err);
		});
		logger.info("Deleted conversation with _id: "+ req.params.conv_id);
		//res.status(200).send(del);
	})
	.catch((err)=>{
		logger.error("Could not find Conversation with that ID.  _id: "+ req.params.conv_id);
		res.status(404).send({"message":"Could not find Conversation with that ID."});
	});
};

//function for archive conversation
exports.markArchive = function(req, res) {

	archive(req.body.conversations, req.body._id, req.params.olderThanDays, function(response) {
		if (response.result == "success") {
			logger.info("updated conversation with ended flag true and pop off the Ids from conversation array for bot " + req.body.botID);
			res.status(200).send({
				"result": "success"
			});
		} else {
			logger.error("Error" + err);
			res.status(404).send(err);
		}
	});
};

//update the conversation - by ID
exports.update = function(req, res){
	var data = req.body;
	Conversation.findByIdAndUpdate(req.params.conv_id, data, {'new':true})
	.then((singleConvo)=>{
		logger.info("Updated conversation with _id: "+ singleConvo._id + " Updated fields: " + Object.keys(data));
		res.status(200).send(singleConvo);
	})
	.catch((err)=>{
		logger.error("Error finding a converastion with that ID.  " + err);
		res.status(404).send({"message":"Could not find Conversation with that ID."});
	});

};

//update the conversation - by ID
exports.updateMiscData = function(req, res){
	var query = {
		conversationID: req.params.conv_id,
		owner: req.authdata._id
	}
	Conversation.findOneAndUpdate(query, {miscData: req.body}, {'new':true})
	.then((singleConvo)=>{
		if(singleConvo) res.sendStatus(200);
		else{
			logger.error("Error finding a converastion with that ID.  " + err);
			res.status(404).send({"message":"Could not find Conversation with that ID."});
		}
	})
	.catch((err)=>{
		logger.error("Error finding a converastion with that ID.  " + err);
		res.status(404).send({"message":"Could not find Conversation with that ID."});
	});

};

//get the conversation details - by ID
exports.listById = function(req, res, next){

	Conversation.findById(req.params.conv_id)
	.then((singleConvo)=>{
		if(singleConvo){
			singleConvo.messages = _.sortBy(singleConvo.messages, ['timestamp'])
			res.status(200).send(singleConvo);
		}else{
			logger.error("Could not find convo with that ID.");
			res.status(404).send({"message":"Could not find convo with that ID."});
		}
	})
	.catch((err)=>{
		logger.error(err);
		res.status(500).send({"message":"Could not find convo with that ID."});
	});

};


function createConversationObject(message, authdata){
	return new Conversation({
		user: [message.user],
		channel: message.channel,
		conversationID: message.conversationID,
		owner: authdata._id,
		messages: [message]
	})

}
//archive.flushOldConversation(0);
