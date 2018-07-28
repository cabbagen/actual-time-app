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

// 创建 channel - params 与 schema 相同
channelsSchema.statics.createChatChannel = function(params) {
  return this.create(params).catch(function(error) {
    console.log(error);
  });
}

channelsSchema.statics.updateChatChannel = function(condition, params) {
  return this.update(condition, params).exec().catch(function(error) {
    console.log(error);
  });
}

// 获取某一个聊天信道
channelsSchema.statics.getChatChannel = function(source, target) {
  const channel_first_id = `${source}@@${target}`;
  const channel_seconed_id = `${target}@@${source}`;

  return this.findOne({ channel_id: { $in: [channel_first_id, channel_seconed_id] } }).exec()
    .catch(function(error) {
      console.log(error);
    });
}

// 获取用户当前使用的聊天通道
channelsSchema.statics.getCurrentChatChannel = function(source) {
  return this.findOne({ channel_id: { $regex: source }, channel_state: 1 }).exec()
    .catch(function(error) {
      console.log(error);
    });
}

// 获取联系人相关的所有聊天信道
channelsSchema.statics.getRelatedChannels = function(contactId, selectedFieldParams) {
  return this.find({ channel_id: { $regex: contactId } }, selectedFieldParams).exec()
    .catch(function(error) {
      console.log(error);
    });
}


module.exports = channelsSchema;
