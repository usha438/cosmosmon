const loginController = require("../controllers/loginController.js");
const conversationController = require("../controllers/conversationController.js");
const authController = require('../controllers/authController');

const loeSpecificController = require('../controllers/loeSpecificController');

module.exports = function(app, router){


	app.route('/login')
	.get(loginController.getUser);

	app.route('/user')
	.post(loginController.create);

	app.route('/conversation')
	.get(conversationController.list);

	app.route('/conversation/archiveConversations/:olderThanDays')
	.put(conversationController.markArchive);
	// .put(conversationController.test);

	app.use('/registerconversation', authController.clipToken, authController.veriftyToken, authController.standardizeDate)
	.route('/registerconversation')
	.post(conversationController.createOrUpdate);

	app.route('/conversation/:conv_id')
	.get(conversationController.listById)
	.put(conversationController.update)
	.delete(conversationController.remove);

	app.use('/miscData/:conv_id', authController.clipToken, authController.veriftyToken)
	.route('/miscData/:conv_id')
	.put(conversationController.updateMiscData);

	app.route('/retrieveProjectData/:doc_id')
	.get(loeSpecificController.retrieveProjectData);


}
