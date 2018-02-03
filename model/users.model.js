const mongoose = require('mongoose');
const usersSchema = require('../schema/users.schema');

const UsersModel = mongoose.model('users', usersSchema);

module.exports = UsersModel;
