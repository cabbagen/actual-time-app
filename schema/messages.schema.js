const mongoose = require('mongoose');
const { modelLogger, databaseError } = require('./common.js');

const Schema = mongoose.Schema;
const messagesSchema = new Schema({
  message_type: Number,
  message_state: Number,
  message_target_group: Schema.Types.ObjectId,
  message_content: String,
  message_source: { type: Schema.Types.ObjectId, ref: 'contacts' },
  message_target: { type: Schema.Types.ObjectId, ref: 'contacts' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  appkey: String,
});

// 添加消息记录 - 字段和 schema 相同
messagesSchema.statics.addMessage = function(params, callback) {
  return this.create(params).then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

messagesSchema.statics.getMessages = function(params, callback) {
  return this.find(params).populate('message_source').populate('msg_target').exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

module.exports = messagesSchema;
