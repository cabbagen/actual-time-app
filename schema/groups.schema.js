const mongoose = require('mongoose');
const { modelLogger, databaseError, paramsError } = require('./common.js');

const Schema = mongoose.Schema;

const groupsSchema = new Schema({
  group_name: { type: String, queue: true },
  group_introduce: { type: String, default: '暂无群介绍' },
  group_avator: String,
  creator: { type: Schema.Types.ObjectId, ref: 'contacts' },
  members: [{ type: Schema.Types.ObjectId, ref: 'contacts' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  appkey: String,
});

module.exports = groupsSchema;
