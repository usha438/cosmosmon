const botcontroller = require("../controllers/botController.js");
const authController = require('../controllers/authController');

module.exports = function(app, router, logger){


   app.route('/bot')
  .get(botcontroller.list)
  .post(botcontroller.create)

  app.use('/bot/customSettings/', authController.clipToken, authController.veriftyToken)
  app.route('/bot/customSettings/')
  .get(botcontroller.getCustomSettings);

  app.route('/bot/:bot_id')
  .get(botcontroller.getBotById)
  .put(botcontroller.update)
  .delete(botcontroller.remove);


  app.route('/bot/:key/:value')
  .get(botcontroller.find);

   app.route('/getUsers')
  .get(botcontroller.countOfUsers);

}
