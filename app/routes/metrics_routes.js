const conversationController = require("../controllers/conversationController.js");
const metricsController = require("../controllers/metricsController.js");

module.exports = function(app, router){
  app.route('/getMetrics/:bot_id')
	.get(metricsController.calculateMetrics);
}
