const mongoose = require('mongoose');
const channelsSchema = require('../schema/channels.schema');

const ChannelsModel = mongoose.model('channels', channelsSchema);

module.exports = ChannelsModel;
