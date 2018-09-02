const mongoose = require('mongoose');

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

module.exports = messagesSchema;
