const ContactModel = require('../../model/contacts.model');
const { callbackDecorator } = require('../../kernel/core');

class ContactService {

  loginIMService(appkey, id, socketId) {
    const params = { appkey, id };
    const updatedParams = { state: 1, socket_id: socketId };

    callbackDecorator(ContactModel.updateContaceInfo.bind(ContactModel), params, updatedParams);
  }

  logoutIMService(socketId) {
    callbackDecorator(ContactModel.setContactStatusBySocketId.bind(ContactModel), socketId, 0);
  }

  getContactIsOnLine(appkey, id) {
    const condition = { appkey, id };
    const selectedFieldParams = { state: 1 };

    return callbackDecorator(ContactModel.getContactInfo.bind(ContactModel), condition, selectedFieldParams, true);
  }
}

module.exports = {
  ContactService: new ContactService(),
};
