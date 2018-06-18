const ContactModel = require('../../model/contacts.model');

class ContactService {

  async loginIMService(appkey, id, socketId) {
    const params = { appkey, id };
    const updatedParams = { state: 1, socket_id: socketId };

    return await ContactModel.updateContaceInfo(params, updatedParams);
  }

  async logoutIMService(socketId) {
    return await ContactModel.setContactStatusBySocketId(socketId, 0);
  }

  async getContactIsOnLine(appkey, id) {
    const condition = { appkey, id };
    const selectedFieldParams = { state: 1 };

    return await ContactModel.getContactInfo(condition, selectedFieldParams, true);
  }
}

module.exports = {
  ContactService: new ContactService(),
};
