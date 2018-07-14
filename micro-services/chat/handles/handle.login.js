const { ContactService } = require('../database/chat.contacts');

exports.handleIMLogin = function (socket, data) {
  ContactService.loginIMService(data.appkey, data.id, socket.client.id);
}
