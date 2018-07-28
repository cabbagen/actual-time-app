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
messagesSchema.statics.addMessage = function(params) {
  return this.create(params).catch(function(error) {
    console.log(error);
  });
}

messagesSchema.statics.getMessages = function(params) {
  return this.find(params).populate('message_source').populate('message_target').exec()
    .catch(function(error) {
      console.log(error);
    });
}

messagesSchema.statics.getRecentContactInfos = function(sourceId) {
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
        _id: '$message_channel',
        last_message: { $last: '$message_content' },
        last_target: { $last: '$message_target' },
        last_target_group: { $last: '$message_target_group' },
        last_source: { $last: '$message_source' },
        last_time: { $last: '$created_at' },
        total: { $sum: 1 }
      }
    },
    {
      $lookup: { from: 'contacts', localField: 'last_target', foreignField: '_id', as: 'last_target' }
    },
    {
      $lookup: { from: 'contacts', localField: 'last_source', foreignField: '_id', as: 'last_source' }
    },
    {
      $lookup: { from: 'groups', localField: 'last_target_group', foreignField: '_id', as: 'last_target_group' }
    }
  ]).exec().catch(function(error) {
    console.log(error);
  });
}

module.exports = messagesSchema;
