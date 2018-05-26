const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelsSchema = new Schema({
  channel_id: String,
  channel_members: [{ type: Schema.Types.ObjectId, ref: 'contacts' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = channelsSchema;