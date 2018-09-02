const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  username: { type: String, index: true, unique: true },
  nickname: String,
  avator: String,
  extra: { type: String, default: '这个人很懒' },
  gender: Number,
  friends: [{ type: Schema.Types.ObjectId, ref: 'contacts' }],
  email: { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  socket_id: String,
  groups: [{ type: Schema.Types.ObjectId, ref: 'groups' }],
  appkey: String,
  state: Number,
});

module.exports = contactsSchema;
