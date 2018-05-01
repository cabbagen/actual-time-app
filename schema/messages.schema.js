const mongoose = require('mongoose');
const { modelLogger, databaseError } = require('./common.js');

const Schema = mongoose.Schema;

const messagesSchema = new Schema({
  _id: Schema.Types.ObjectId,
  msg_type: Number,
  msg_state: Number,
  msg_from_group: Schema.Types.ObjectId,
  msg_content: String,
  msg_from_contact: Schema.Types.ObjectId,
  msg_to_contact: Schema.Types.ObjectId,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  app_key: String,
});

// 获取单人间的聊天记录
messagesSchema.statics.getMessages = function(params, callback) {
  return this.find(params).limit(20).exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

// 获取最近联系人
messagesSchema.statics.getRecentContacts = function(params, callback) {
  return this.find({ $or: [{ from: mongoose.Types.ObjectId(params._id) }, { to: mongoose.Types.ObjectId(params._id) }] })
    .limit(20).exec().then((data) => {
      callback(null, data);
    }, (error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
}

module.exports = messagesSchema;