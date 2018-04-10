const loggerProvider = require('../providers/log.provider.js');

const modelLogger = loggerProvider.getLoggerInstance('model');

const databaseError = new Error("数据库操作失败");

module.exports = {
  modelLogger,
  databaseError,
};