const mongoose = require('mongoose');
const messagesSchema = require('../schema/messages.schema.js');

const MessagesModel = mongoose.model('messages', messagesSchema);

module.exports = MessagesModel;
