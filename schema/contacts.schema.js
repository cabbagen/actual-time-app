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
  socket_id: String,
  groups: [{ type: Schema.Types.ObjectId, ref: 'groups' }],
  appkey: String,
  state: Number,
});

contactsSchema.statics.getContactsFromGroupOrAll = function(params) {
  if (!params.appKey) return null;

  const query = { appKey: params.appKey };

  if (typeof params.groupId !== 'undefined' && params.groupId) {
    query.groups = { $all: [ mongoose.Types.ObjectId(params.groupId) ] };
  }

  return this.find(query).exec().catch(function(error) {
    console.log(error);
  });
}

// 创建联系人 - 字段 和 schema 相同
contactsSchema.statics.addContacts = function(params) {
  return this.create(params).catch(function(error) {
    console.log(error);
  });
}

contactsSchema.statics.getContactInfo = function(params, selectedFieldParams = {}, isBased = false) {
  if (!params.appkey || !params.id) return null;
  
  const condition = { appkey: params.appkey, _id: mongoose.Types.ObjectId(params.id) };

  if (isBased) {
    return this.findOne(condition, selectedFieldParams).exec().catch(function(error) {
      console.log(error);
    });
  }

  return this.findOne(condition, selectedFieldParams).populate('friends').populate('groups').exec()
    .catch(function(error) {
      console.log(error);
    });
  
}

contactsSchema.statics.updateContaceInfo = function(params, updateInfo) {
  if (!params.appkey || !params.id) return null;

  const condition = { appkey: params.appkey, _id: mongoose.Types.ObjectId(params.id) };
  return this.update(condition, updateInfo).exec().catch(function(error) {
    console.log(error);
  });
}

contactsSchema.statics.removeContactInfo = function(params) {
  if (!params.appkey || !params.id) return null;

  const condition = { appkey: params.appkey, _id: mongoose.Types.ObjectId(params.id) };

  return this.remove(condition).exec().catch(function(error) {
    console.log(error);
  });
}

contactsSchema.statics.setContactStatusBySocketId = function(socketId, state) {
  if (typeof socketId === 'undefined') return null;

  return this.update({ socket_id: socketId }, { state }).exec().catch(function(error) {
    console.log(error);
  });
}

module.exports = contactsSchema;
