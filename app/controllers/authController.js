const logger = require('../_log/logger_def.js');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const botController = require('./botController.js');

exports.createNewReference = function(req, res){
  var botObj =  {
    "_id" : req.body._id,
    "createdAt" : req.body.createdAt,
    "referenceID" : crypto.randomBytes(16).toString('hex')
  };
  exports.createToken(botObj)
  .then(function(token){
    botController.updateBot(req.body._id, {"referenceID" : botObj.referenceID})
    .then((singleBot)=>{
  		logger.info("Updated bot with _id: "+ singleBot._id + " Updated fields: referenceID");
      singleBot = singleBot.toObject();
      singleBot.token = token;
  		res.status(200).send(singleBot);
  	})
  	.catch((err)=>{
  		logger.error("Error finding a bot with that ID.  " + err);
  		res.status(404).send({"message":"Could not find bot with that ID."});
  	});
  });
}

exports.createToken = function(newBotObj){
  //must be ATLEAST sent the bot._id, .referenceID, .createdAt
  logger.info('Token creation request for bot _id: ' + newBotObj._id);
  var payload = _.pick(newBotObj, ['_id','createdAt']);
  return new Promise(function(fulfill, reject){
    jwt.sign(payload, exports.createHash(newBotObj.referenceID), (err, token)=>{
      fulfill(token);
    });

  })
};

exports.createHash = function(text){
  return crypto.createHash('md5').update(text+text.substring(0, 20)).digest("hex");
};

exports.veriftyToken = function(req, res, next){
  logger.info('verification request - bot refID: '+ req.refid);
  jwt.verify(req.token, exports.createHash(req.refid), (err, authdata)=>{
    if(err){
      logger.error("Verification attempt failed.");
      res.sendStatus(403);
    }else{
      req.authdata = authdata;
      next();
    }
  })
};

exports.clipToken = function(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    req.refid = req.headers['refid'];
    next();
  } else {
    res.sendStatus(403);
  }
};

exports.standardizeDate = function(req, res, next){
  var d = new Date(req.body.timestamp);
  req.body.timestamp =  d.toISOString();
  next();
}

exports.testRoute = function(req, res){

   var d = new Date("2018-02-19T16:29:36.4581568+00:00");
   console.log(d.toISOString());
  res.status(200).json(crypto.randomBytes(16).toString('hex'));
}
