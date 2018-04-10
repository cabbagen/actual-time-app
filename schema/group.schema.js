const mongoose = require('mongoose');
// const { modelLogger, databaseError } = require('./common.js');

const Schema = mongoose.Schema;

const groupsSchema = new Schema({
  creator: Object,
  members: [Object],
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  appKey: String,
});


module.exports = groupsSchema;