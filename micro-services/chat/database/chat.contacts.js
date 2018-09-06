const ContactModel = require('../../../model/contacts.model').init();

class ContactService {
  async loginIMService(appkey, id, socketId) {
    const params = { appkey, id };
    const updatedInfo = { state: 1, socket_id: socketId };

    ContactModel.updateContactInfo(params, updatedInfo);
  }

  async logoutIMService(socketId) {
    ContactModel.setContactStatusBySocketId(socketId, 0);
  }

  async getContactIsOnLine(appkey, id) {
    const condition = { appkey, id };
    const selected = { state: 1 };

    return await ContactModel.getContactRelatedInfo(condition, selected, true);
  }
}

module.exports = {
  ContactService: new ContactService(),
};
