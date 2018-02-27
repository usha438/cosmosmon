var mongoose = require('mongoose'),
  User = require('../models/loginModel');
const logger = require('../_log/logger_def.js');
mongoose.Promise = require('bluebird');

//get the user details - by ID
exports.getUser = function(req, res, next) {

  User.getUserByField({
    "userid": req.query.userid
  }, function(err, user) {
    var newUser = User();
    console.log(req.query.userid);
    if (user.length > 0) {
      if (newUser.validPassword(req.query.password, user[0].password) == false) {
        response = {
          "message": "sorry wrong password"
        }
        logger.error("Sorry! You have enetered wrong Password");
        res.status(404).send(response);
      } else {
        response = {
          "message": "Loggin success"
        }

        logger.info("You are succesfuly logged in.");
        res.status(200).send(user);
      }

    } else {

      logger.error("Oops! Wrong User does not exist. Please register");
      response = {
        "message": "Please check entered ID or Please try again later"
      }
      res.status(404).send(response);
    }
  });
};

//create the student details
exports.create = function(req, res) {

  User.getUserByField({
    "userid": req.body.userid
  }, function(err, user) {

    if (user.length > 0) {

      response = {
        "message": "User already existed"
      }
      logger.error("User already registered with this Id" + req.body.userid);
      res.status(404).send(response);

    } else {

      //Calls function in user.js model
      var newUser = new User();
      newUser.userid = req.body.userid;
      newUser.password = newUser.generateHash(req.body.password);
      User.addUser(newUser, function(err, user) {
        if (user) {
          response = {
            "message": "Data inserted succesfully"
          }
          logger.info("User registration success for id " + req.body.userid);
          res.status(200).send(user);
        } else {
          response = {
            "message": "Sorry insertion failed"
          }
          logger.error("User registration failed for id " + req.body.userid);
          res.status(404).send(response);
        }
      });
    }

  })
};
