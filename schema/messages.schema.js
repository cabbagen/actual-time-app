const mongoose = require('mongoose');
const { modelLogger, databaseError } = require('./commen.js');

const Schema = mongoose.Schema;

const messagesSchema = new Schema({
  groupId: Object,
  from: Object,
  to: Object,
  state: Number,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  appKey: String,
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

module.exports = messagesSchema;