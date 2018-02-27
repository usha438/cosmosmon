const winston = require('winston');
const timeS = () => (new Date()).toLocaleTimeString();

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: timeS,
      colorize: true
    })
  ]
});
