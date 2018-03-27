const mongoose = require('mongoose');

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

module.exports = messagesSchema;