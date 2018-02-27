const logger = require('../_log/logger_def.js');
const authController = require('../controllers/authController');

//DRAFT ROUTES FOR AUTH

module.exports = function(app, router){

  app.use('/verify', authController.clipToken, authController.veriftyToken)
  .route('/verify')
  .post((req, res)=>{
    console.log(req.body);
    res.status(200).send(req.authdata);
    function checkIfExists(arrayOfObjects, key, object) {
        return _.some(arrayOfObjects, function(eachObject) {
            return eachObject[key].toUpperCase() == object[key].toUpperCase();
        });
    };
  });

  //must be ATLEAST sent the bot._id, .referenceID, .createdAt
  app.route('/token')
  .get(authController.createToken);

  app.route('/auth/renewtoken') 
  .post(authController.createNewReference);

  app.route('/testRoute')
  .get(authController.testRoute);
}

function checkIfExists(arrayOfObjects, key, object) {
	return _.some(arrayOfObjects, function(eachObject) {
		return eachObject[key].toUpperCase() == object[key].toUpperCase();
	});
};
