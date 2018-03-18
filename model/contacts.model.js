const mongoose = require('mongoose');
const contactsSchema = require('../schema/contacts.schema');

const contactsModel = mongoose.model('contacts', contactsSchema);

module.exports = contactsModel;
