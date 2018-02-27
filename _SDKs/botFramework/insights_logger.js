const request = require('request');
var token, reference;

var insightsModule = function(auth_token, bot_reference){
  token = process.env.M_INSIGHTS_TOKEN;
  reference = process.env.M_INSIGHTS_REF;
};

insightsModule.prototype.logMessage = function(messageObj){
  if(messageObj.message){
    console.log(messageObj);
    var messageData = {};
    messageData.origin = "User";
    messageData.type= messageObj.message.type;
    messageData.user = messageObj.message.address.user;
    messageData.conversationID= messageObj.message.address.conversation.id;
    messageData.text= messageObj.message.text;
    messageData.timestamp = new Date();
    messageData.channel = messageObj.message.source;
    reportMessage(messageData);
  }else{
    if(messageObj.type == 'message'){
      var messageData = {};
      messageData.conversationID = messageObj.address.conversation.id;
      messageData.timestamp = new Date();
      messageData.channel = messageObj.source;
      messageData.text = messageObj.text;
      messageData.user = messageObj.address.user;
      messageData.origin = "Bot";
      messageData.type = messageObj.type;
      reportMessage(messageData);
    }
  };

}

module.exports = insightsModule;

function reportMessage(messageData){

  var requestPayload = {
    url:  "http://localhost:8000/registerconversation/",
    method: 'POST',
    json: true,
    headers: {
      'refid': reference
    },
    auth:{
      'bearer': token
    },
    body: messageData
  };
  return new Promise(function(fulfill, reject){
    request.post(requestPayload, function (err, response, body) {
      if (!err) {
        console.log(body);
      } else {
        console.log(err);
      }
    });
  })
}
