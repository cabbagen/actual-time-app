const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  username: { type: String, index: true, unique: true },
  nickname: String,
  avator: String,
  gender: Number,  
  email: { type: String, unique: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  groups: [Object],
  records: [Object],
});


module.exports = contactsSchema;