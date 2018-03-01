const logger = require('./app/_log/logger_def.js');

//other deps
const express = require('express');
const bodyParser = require('body-parser');
//Importing Mongoose library
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const router = express.Router();
//var mongoClient = require("mongodb").MongoClient;


var port = process.env.PORT || 8000;
// var uri=process.env.URI;
//var uri = "mongodb://localhost/botInsights";
console.log("Application Environment : " + app.settings.env);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
var config = require('./_config');
//Enabling CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Connecting to the MongoDB database 'test_for_db' running on 27017
// mongoose.connect("mongodb://shrikar:63916@ds131258.mlab.com:31258/minsights");
//enable the mongoose database uri for both testing and developmentvar mongoClient = require("mongodb").MongoClient;
mongoose.connect("mongodb://walgreenscosmo:4e2olbW1wWhOBgLQx3iYea1FQLH9mLEJcAFwf2U6N9FYtbxVI9oNzq3TkZFwCFQQ2jXs23c35KqLY2Yk5bAaow==@walgreenscosmo.documents.azure.com:10255/?ssl=true")
 
//mongoose.connect(config.mongoURI[app.settings.env]);
mongoose.connection.on('error', (err) => {
  //if conenction fails
  console.log("\n");
  logger.error(err.message);

});
mongoose.connection.once('open',  () => {
  logger.info("Connected to the DB at : " + config.mongoURI[app.settings.env]);
});

//import routes
require('./app/routes/convo_routes')(app, router, logger);
require('./app/routes/bot_routes')(app, router, logger);
require('./app/routes/auth_routes')(app, router, logger);
require('./app/routes/metrics_routes')(app, router, logger);

var path = require('path');
app.use('/', express.static(path.join(__dirname, 'dist')));

app.get('/index',function(req,res){
	res.sendFile(__dirname+"/dist/index.html");
});


app.listen(port);
console.log("Server started at: " + port);
module.exports=app;
