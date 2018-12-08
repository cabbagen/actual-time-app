const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  appkey: String,
  notice_type: Number,
  source_contact_id: String,
  target_contact_id: String,
  target_group_id: String,
  notice_text: { type: String, default: '有您的一条消息' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = contactsSchema;
