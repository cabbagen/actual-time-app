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
    const result = Object.assign({}, data);
    const adaptedTimeData = Object.assign({}, result._doc, {
      created_at: moment(data.created_at).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(data.updated_at).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss'),
    });
    callback(null, adaptedTimeData);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

messagesSchema.statics.getMessageRecords = function(sourceId) {

}

module.exports = messagesSchema;
