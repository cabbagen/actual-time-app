const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const channelsSchema = new Schema({
  channel_id: String,
  channel_state: Number,    // 信道是否在应用  0 => 未在使用  1 => 在使用
  channel_members: [{ type: Schema.Types.ObjectId, ref: 'contacts' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  appkey: String,
});

module.exports = channelsSchema;
