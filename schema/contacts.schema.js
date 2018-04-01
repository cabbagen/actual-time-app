const mongoose = require('mongoose');
const { modelLogger, databaseError } = require('./commen.js');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  username: { type: String, index: true, unique: true },
  nickname: String,
  avator: String,
  gender: Number,  
  email: { type: String, unique: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  records: [Number],
  appKey: String,
});

/**
 * 查询 IM 用户列表
 * 查询对象: params: format: { appKey: [String], groupId: [?Number] }
 */
contactsSchema.statics.getContacts = function(params, callback) {
  const query = { appKey: params.appKey };
  if (typeof params.groupId !== 'undefined' && params.groupId) {
    query.groups = { $all: [ parseInt(params.groupId, 10) ] };
  }

  return this.find(query).exec().then((data) => {
    callback(null, data);
  }, (error) => {
    // ... 记录错误日志
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

/**
 * 批量导入 IM 用户
 */
contactsSchema.statics.addContacts = function(params, callback) {
  return this.create(params).then((data) => {
    callback(null, data);
  }, (error) => {
    // ... 记录错误日志
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

/**
 * 获取指定的 IM 用户信息
 * 查询对象: params: format: { appKey: [String], username: [String] }
 */
contactsSchema.statics.getContactInfo = function(params, callback) {
  return this.findOne(params).exec().then((data) => {
    callback(null, data);
  }, (error) => {
    // ... 记录错误日志
    modelLogger.error(error.message);
    callback(databaseError, null);
  });

  /**
   * 更新 IM 用户信息
   * 查询对象: params: format: { appKey: [String], username: [String] }
   * 更新对象: updateInfo
   */
  contactsSchema.statics.updateContaceInfo = function(params, updateInfo, callback) {
    return this.update(params, updateInfo).exec().then((data) => {
      callback(null, data);
    }, (error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
  }

  /**
   * 删除 IM 用户信息
   * 删除查询对象 params: { appKey: [String], username: [String] }
   */
  contactsSchema.statics.removeContactInfo = function(params, callback) {
    return this.remove(params).exec().then((data) => {
      callback(null, data);
    }, (error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
  }
  
}


module.exports = contactsSchema;