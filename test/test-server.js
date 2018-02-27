process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var server = require('../server.js');
var Conversation = require("../app/models/conversationModel.js");
var Bot = require("../app/models/botModel.js");
var User = require("../app/models/loginModel.js");

var should = chai.should();
chai.use(chaiHttp);


// start of test cases for conversation APIs//
describe('Conversations', function() {
  //chai property "after" gets called after completion of all the test cases for Conversation APIs
  after(function(done) {
    Conversation.remove({}, (err) => {
      console.log('removed the data');
      done();
    });
  });


  //test case for "/registerconversation" register or update a conversation API
  it('should add a SINGLE conversation on /registerconversation POST', function(done) {
    chai.request(server)
      .post('/registerconversation')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTY3YTgzNThkZDhhZDAxNjQ2ZTBhNGIiLCJjcmVhdGVkQXQiOiIyMDE4LTAxLTIzVDIxOjI1OjA5LjMzMloiLCJpYXQiOjE1MTY3NDI3MDl9.nS_BoXLEZ9IEoxOwWp6B_diDEU5y9oUf0I9CTytaDTk')
      .set('Content-Type', 'application/json')
      .set('refid', 'e09b61f5bccc2b5cb74a5f7788824df4')
      .send({
        "conversationID": "i9c5aibj7442",
        "timestamp": "2018-01-19T19:24:43.518Z",
        "channel": "emulator",
        "text": "Hi this is test case",
        "user": [{
          "id": "default-user",
          "name": "User"
        }],
        "origin": "bot",
        "type": "message"
      })
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  //test case for "/conversation" get the list of conversations API
  it('should list ALL conversations on /conversation GET', function(done) {
    chai.request(server)
      .get('/conversation')
      .end(function(err, res) {
        console.log(res.body);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        //res.body[0].should.have.property('_id');
        done();
      });
  });

  //test case for "/conversation/:conv_id" get conversation by Id API
  it('should list a SINGLE conversation on /conversation/<id> GET', function(done) {

    chai.request(server)
      .get('/conversation')
      .end(function(err, response) {
        response.should.have.status(200);
        response.body.length.should.above(0);
        chai.request(server)
          .get('/conversation/' + response.body[0]._id)
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body._id.should.equal(response.body[0]._id);
            done();
          })
      });
  });



  /*  it('should update a SINGLE conversation on /conversation/<id> PUT', function(done) {
    chai.request(server)
      .get('/conversation')
      .end(function(err, res){
		  var user = "test_user1"
        chai.request(server)
          .put('/conversation/'+res.body[0]._id)
          .send({'user': user})
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.have.property('user');
            response.body.should.have.property('_id');
            response.body.user.should.equal(user);
            done();
        });
      });
  }); */

  //test case for "/conversation/:conv_id" delete by Id API
  it('should delete a SINGLE conversation on /conversation/<id> DELETE', function(done) {
    chai.request(server)
      .get('/conversation')
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.length.should.above(0);
        chai.request(server)
          .delete('/conversation/' + res.body[0]._id)
          .end(function(error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.have.property('n');
            response.body.n.should.equal(1);
            response.body.should.have.property('ok');
            response.body.ok.should.equal(1);
            done();
          });
      });
  });

});

// end of test cases for conversation APIs//



//start of test cases for bot APIs//
describe('Bots', function() {
  // chai property "beforeEach" will gets called before each test case of Bot API
  beforeEach(function(done) {
    var newBot = new Bot({
        "name": "IPG Bot",
        "org":"miracle software systems",
        "framework":"Bot Framework",
        "description":"sample bot for IPG",
		"referenceID": "1"
      });
    newBot.save(function(err) {
      done();
    });
  });

  // chai property "beforeEach" will gets called after each test case of Bot API
  afterEach(function(done) {
    Bot.remove({}, (err) => {
      done();
    });
  });

  //test case for "/bot" get list of bots API
  it('should list ALL bots on /bot GET', function(done) {
    chai.request(server)
      .get('/bot')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('referenceID');
        res.body[0].conversations.should.be.a('array');
        done();
      });
  });


  //test case for "/bot/:bot_id" get bot details by Id API
  it('should list a SINGLE bot on /bot/<id> GET', function(done) {
    var data1 = {
        "name": "Airlines Bot",
        "org":"miracle software systems",
        "framework":"Bot Framework",
        "description":"sample bot for Airlines",
        "referenceID": "2"
      }
    var newBot = new Bot(data1);
    newBot.save(function(err, data) {
      chai.request(server)
        .get('/bot/' + data.id)
        .end(function(err, res) {
          console.log('2');
          console.log(err);
          console.log(res);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.name.should.equal(data.name);
          res.body.conversations.should.be.a('array');
          done();
        });
    });
  });

  //test case for "/bot" add a bot API
  it('should add a SINGLE bot on /bot POST', function(done) {
    chai.request(server)
      .post('/bot')
      .send({
        "name": "LUIS Bot",
        "org":"miracle software systems",
        "framework":"Bot Framework",
        "description":"sample bot for LUIS"
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('name');
        res.body.should.have.property('_id');
        res.body.name.should.equal("luis bot");
        res.body.conversations.should.be.a('array');
        res.body.should.have.property('token');
        done();
      });
  });

  //test case for "/bot/:bot_id" update a bot by Id API
  it('should update a SINGLE bot on /bot/<id> PUT', function(done) {
    chai.request(server)
      .get('/bot')
      .end(function(err, res) {
        var name = "IPG Bot1"
        chai.request(server)
          .put('/bot/' + res.body[0]._id)
          .send({
            'name': name
          })
          .end(function(error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.have.property('name');
            response.body.should.have.property('_id');
            response.body.name.should.equal(name);
            response.body.conversations.should.be.a('array');
            done();
          });
      });
  });

  //test case for "/bot/:bot_id" delete a bot by Id API
  it('should delete a SINGLE bot on /bot/<id> DELETE', function(done) {
    chai.request(server)
      .get('/bot')
      .end(function(err, res) {
        chai.request(server)
          .delete('/bot/' + res.body[0]._id)
          .end(function(error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.have.property('n');
            response.body.n.should.equal(1);
            response.body.should.have.property('ok');
            response.body.ok.should.equal(1);
            done();
          });
      });
  });

});

//end of test cases for bot APIs//

//start of test cases for login APIs//
describe('User', function() {
  before(function(done) {
    User.remove({}, (err) => {
      console.log('removed the data');
      done();
    });
  });

  //test case for "/user" register a user API
  it('should register a user on /user api', function(done) {
    var data = {
      "userid": "testuser",
      "password": "testpassword"
    }
    chai.request(server)
      .post('/user')
      .send(data)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('_id');
        res.body.should.have.property('userid');
        res.body.userid.should.equal(data.userid);
        done();
      });
  });

  //test case for "/login" to authenticate registered user API
  it('should authenticate registered user on /login api', function(done) {
    var data = {
      "userid": "testuser",
      "password": "testpassword"
    }
    var newUser = new User(data);
    chai.request(server)
      .get('/login?userid=' + data.userid + '&password=' + data.password)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('userid');
        res.body[0].userid.should.equal(data.userid);
        done();
      });
  });
});

//end of test cases for login APIs//
