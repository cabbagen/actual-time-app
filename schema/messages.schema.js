const mongoose = require('mongoose');
const { modelLogger, databaseError } = require('./common.js');

const Schema = mongoose.Schema;

const messagesSchema = new Schema({
  msg_type: Number,
  msg_state: Number,
  msg_from_group: Schema.Types.ObjectId,
  msg_content: String,
  msg_from_contact: { type: Schema.Types.ObjectId, ref: 'contacts' },
  msg_to_contact: { type: Schema.Types.ObjectId, ref: 'contacts' },
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

messagesSchema.statics.getOneMessage = function(params, callback) {
  return this.findOne(params).populate('msg_from_contact').populate('msg_to_contact').exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

module.exports = messagesSchema;
