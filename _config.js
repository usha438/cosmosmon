var config = {};

config.mongoURI = {
  production: 'mongodb://walgreenscosmo:4e2olbW1wWhOBgLQx3iYea1FQLH9mLEJcAFwf2U6N9FYtbxVI9oNzq3TkZFwCFQQ2jXs23c35KqLY2Yk5bAaow==@walgreenscosmo.documents.azure.com:10255/?ssl=true',
  development_s: 'mongodb://shrikar:63916@ds131258.mlab.com:31258/minsights',
  development_p: 'mongodb://pavani:pavani@ds117878.mlab.com:17878/bot_insights',
  development: 'mongodb://pavani:pavani@ds117878.mlab.com:17878/bot_insights',
  test: 'mongodb://pavani:pavani@ds117878.mlab.com:17878/bot_insights_test',
  local : "mongodb://localhost/botInsights",
};

module.exports = config;
