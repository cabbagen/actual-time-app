const { ContactService } = require('../database/chat.contacts');

exports.handleIMLogout = function(socket) {
  ContactService.logoutIMService(socket.client.id);
}
