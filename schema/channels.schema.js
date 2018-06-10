const mongoose = require('mongoose');
const { callbackDecorator } = require('../kernel/core.js');
const { modelLogger, databaseError } = require('./common.js');

const Schema = mongoose.Schema;
const channelsSchema = new Schema({
  channel_id: String,
  channel_state: Number,    // 信道是否在应用  0 => 未在使用  1 => 在使用
  channel_members: [{ type: Schema.Types.ObjectId, ref: 'contacts' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  appkey: String,
});

// 添加聊天信道 - 字段和 schema 相同
channelsSchema.statics.createChatChannel = function(params, callback) {
  const source = params.channel_id.split('@@')[0];
  const target = params.channel_id.split('@@')[1];

  const channel_first_id = `${source}@@${target}`;
  const channel_seconed_id = `${target}@@${source}`;

  return this.findOne({ channel_id: { $in: [channel_first_id, channel_seconed_id] } }).exec()
    .then((data) => {
      if (!data) this.create(params, function(err, data) {
        if (err) console.log(err);
      });
    })
    .catch((error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
}

// 获取聊天信道
channelsSchema.statics.getChatChannel = function(source, target, callback) {
  const channel_first_id = `${source}@@${target}`;
  const channel_seconed_id = `${target}@@${source}`;

  return this.findOne({ channel_id: { $in: [channel_first_id, channel_seconed_id] } }).exec()
    .then((data) => {
      callback(null, data);
    }, (error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
}

// 当用户退出登录时，删除其相关的聊天信道
channelsSchema.statics.removeChatChannelByMember = function(contactId, callback) {
  return this.remove({ channel_members: { $all: [mongoose.Types.ObjectId(contactId)] } }).exec()
    .then((data) => {
      callback(null, data);
    }, (error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
}

module.exports = channelsSchema;
