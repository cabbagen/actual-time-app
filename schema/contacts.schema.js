const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  username: { type: String, index: true, unique: true },
  nickname: String,
  avator: String,
  gender: Number,  
  email: { type: String, unique: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  groups: [Number],
  records: [Number],
  appKey: String,
});

const databaseError = new Error("数据库操作失败");

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
    console.log(error.message);
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
    console.log(error.message);
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
    console.log(error.message);
    callback(databaseError, null);
  });
}


module.exports = contactsSchema;