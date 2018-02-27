const logger = require('../_log/logger_def.js');
const _ = require('lodash');
const request = require('request');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

exports.retrieveProjectData = function(req, res){
  var url = "https://loeservice.azurewebsites.net/api/GetProjectByDocumentId?documentId="+req.params.doc_id+"&code=l7XDoPO76UOzVoisn3Hw9NvZ6xTxRiD0chYD2J5kudnMf33uvcULiA=="
  request.get(url, function(error, response, body){
    if(error){
      res.sendStatus(500);
    }else{
      res.status(200).json(JSON.parse(body));
    }
  });
}
