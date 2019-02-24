const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  appkey: String,
  notice_type: Number,              // 1 => 对个人通知   2 => 对小组的通知
  source_contact_id: String,        // 消息来源人
  target_contact_id: String,        // 消息通知人 => 当为单聊通知时，这为 要通知的人，若为群组时，这将是群主
  target_group_id: String,          // 消息需要通知的群
  notice_text: { type: String, default: '有您的一条消息' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = contactsSchema;
