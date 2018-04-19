const mongoose = require('mongoose');
const contactsSchema = require('../schema/contacts.schema');

const ContactsModel = mongoose.model('contacts', contactsSchema);

module.exports = ContactsModel;
