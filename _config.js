var config = {};

config.mongoURI = {
  production: 'mongodb://shrikar:63916@ds131258.mlab.com:31258/minsights',
  development_s: 'mongodb://shrikar:63916@ds131258.mlab.com:31258/minsights',
  development_p: 'mongodb://pavani:pavani@ds117878.mlab.com:17878/bot_insights',
  development: 'mongodb://pavani:pavani@ds117878.mlab.com:17878/bot_insights',
  test: 'mongodb://pavani:pavani@ds117878.mlab.com:17878/bot_insights_test',
  local : "mongodb://localhost/botInsights",
};

module.exports = config;
