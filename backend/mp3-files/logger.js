var winston = require("winston");

module.exports = exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      level: "debug"
    })
  ]
});
