const mongoose = require('mongoose');
const moment = require('moment');
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
  return this.find(params).populate('message_source').populate('message_target').exec().then((data) => {
    const adaptedTimeData = data.map((message) => {
      const result = Object.assign({}, message);
      return Object.assign({}, result._doc, {
        created_at: moment(message.created_at).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(message.updated_at).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss'),
      });
    });
    callback(null, adaptedTimeData);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

module.exports = messagesSchema;
