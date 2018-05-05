const loggerProvider = require('../providers/log.provider.js');

const modelLogger = loggerProvider.getLoggerInstance('model');

const databaseError = new Error("数据库操作失败, 请检查传入参数");

const paramsError = new Error("查询参数错误");

module.exports = {
  modelLogger,
  databaseError,
  paramsError,
};
