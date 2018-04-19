const mongoose = require('mongoose');
const groupsSchema = require('../schema/groups.schema');

const GroupsModel = mongoose.model('groups', groupsSchema);

module.exports = GroupsModel;
