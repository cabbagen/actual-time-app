const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  username: { type: String, index: true, unique: true },
  password: String,
  provider: [Number],
  avator: String,
  email: { type: String, unique: true },
  extra: String,
  timestamp: { type: Date, default: Date.now },
  gender: Number,
  nickname: String,
  appkey: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = usersSchema;
