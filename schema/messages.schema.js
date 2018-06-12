const mongoose = require('mongoose');
const moment = require('moment');
const { modelLogger, databaseError } = require('./common.js');

const Schema = mongoose.Schema;
const messagesSchema = new Schema({
  message_channel: String,
  message_type: Number,
  message_state: Number,  // 0 => 未读  1 => 已读
  message_target_group: { type: Schema.Types.ObjectId, ref: 'groups' },
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

messagesSchema.statics.getMessage = function(params, callback) {
  return this.findOne(params).populate('message_source').populate('message_target').exec().then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

messagesSchema.statics.getUnReadMessages = function(sourceId, callback) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { message_source: mongoose.Types.ObjectId(sourceId) },
          { message_target: mongoose.Types.ObjectId(sourceId) },
        ],
        message_state: 0,
      }
    },
    {
      $group: {
        _id: "$message_channel",
        last_message: { $last: "$message_content" },
        last_target: { $last: "$message_target" },
        last_target_group: { $last: "$message_target_group" },
        last_source: { $last: "$message_source" },
        last_time: { $last: "$created_at" },
        total: { $sum: 1 }
      }
    }
  ], function(error, data) {
    if (error) {
      modelLogger.error(error.message);
      callback(databaseError, null);
    } else {
      callback(null, data);
    }
  })
}

module.exports = messagesSchema;
