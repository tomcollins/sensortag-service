const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
   format: combine(
    colorize(),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({
        level: 'info',
        handleExceptions: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};