const log4js = require('log4js');
const utils = require('./utils.provider.js');


function initLogger(filename) {
  if (utils.isExistFile(filename)) {
    log4js.configure(filename);
  }
}

function getLoggerInstance(loggerName) {
  return log4js.getLogger(loggerName);
}

module.exports = {
  initLogger,
  getLoggerInstance,
};
