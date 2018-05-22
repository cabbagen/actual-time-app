const mongoose = require('mongoose');
const { modelLogger, databaseError, paramsError } = require('./common.js');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  username: { type: String, index: true, unique: true },
  nickname: String,
  avator: String,
  extra: { type: String, default: '这个人很懒' },
  gender: Number,
  friends: [{ type: Schema.Types.ObjectId, ref: 'contacts' }],
  email: { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  groups: [{ type: Schema.Types.ObjectId, ref: 'groups' }],
  appkey: String,
  status: Number,
});

contactsSchema.statics.getContactsFromGroupOrAll = function(params, callback) {
  if (!params.appKey) {
    callback(paramsError, null);
    return;
  }

  const query = { appKey: params.appKey };

  if (typeof params.groupId !== 'undefined' && params.groupId) {
    query.groups = { $all: [ mongoose.Types.ObjectId(params.groupId) ] };
  }

  return this.find(query).exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

// 创建联系人 - 字段 和 schema 相同
contactsSchema.statics.addContacts = function(params, callback) {
  return this.create(params).then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

contactsSchema.statics.getContactInfo = function(params, callback) {
  if (!params.appkey || !params.id) {
    callback(paramsError, null);
    return;
  }
  
  const condition = { appkey: params.appkey, _id: mongoose.Types.ObjectId(params.id) };

  return this.findOne(condition).populate('friends').populate('groups').exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

contactsSchema.statics.updateContaceInfo = function(params, updateInfo, callback) {
  if (!params.appkey || !params.id) {
    callback(paramsError, null);
    return;
  }

  const condition = { appkey: params.appkey, _id: mongoose.Types.ObjectId(params.id) };
  
  return this.update(condition, updateInfo).exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

contactsSchema.statics.removeContactInfo = function(params, callback) {
  if (!params.appkey || !params.id) {
    callback(paramsError, null);
    return;
  }

  const condition = { appkey: params.appkey, _id: mongoose.Types.ObjectId(params.id) };

  return this.remove(condition).exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}


module.exports = contactsSchema;
