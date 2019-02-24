const { ContactsService } = require('../services/contacts.service');

exports.handleIMLogout = function(socket) {
  ContactsService.logoutIMService(socket.client.id);
}
