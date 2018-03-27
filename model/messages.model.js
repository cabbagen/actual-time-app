const mongoose = require('mongoose');
const messagesSchema = require('../schema/messages.schema.js');

const messagesModel = mongoose.model('contacts', messagesSchema);

module.exports = messagesModel;
