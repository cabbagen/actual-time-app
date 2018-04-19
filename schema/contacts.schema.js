const mongoose = require('mongoose');
const { modelLogger, databaseError, paramsError } = require('./common.js');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: { type: String, index: true, unique: true },
  nickname: String,
  avator: String,
  gender: Number,
  friends: [{ type: Schema.Types.ObjectId, ref: 'contacts' }],
  email: { type: String, unique: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  groups: [{ type: Schema.Types.ObjectId, ref: 'groups' }],
  appKey: String,
});

/**
 * 服务端使用
 * 查询账户下所有导入的 IM 用户， 群组 Id 可用于查找指定组内的 IM 成员
 * 查询对象: params: format: { appKey: [String], groupId: [?Number] }
 */
contactsSchema.statics.getContacts = function(params, callback) {
  if (!params.appKey) {
    callback(paramsError, null);
    return;
  }

  const query = { appKey: params.appKey };

  if (typeof params.groupId !== 'undefined' && params.groupId) {
    query.groups = { $all: [ params.groupId ] };
  }

  return this.find(query).exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

/**
 * 服务端使用
 * 批量导入 IM 用户
 */
contactsSchema.statics.addContacts = function(params, callback) {
  return this.create(params).then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

/**
 * 服务端、客户端使用
 * 获取指定的 IM 用户信息
 * 查询对象: params: format: { appKey: [String], username: [String] }
 */
contactsSchema.statics.getContactInfo = function(params, callback) {
  if (!params.appKey || !params.username) {
    callback(paramsError, null);
    return;
  }
  return this.findOne(params).populate('friends').populate('groups').exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

/**
 * 服务端使用
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
 * 服务端使用
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


module.exports = contactsSchema;