const ContactModel = require('../../../model/contacts.model').init();

class ContactService {
  async loginIMService(appkey, id, socketId) {
    const updatedInfo = { state: 1, socket_id: socketId };
    
    ContactModel.updateContactInfo(appkey, id, updatedInfo);
  }

  async logoutIMService(socketId) {
    ContactModel.setContactStatusBySocketId(socketId, 0);
  }

  /**
   * 判断 IM 用户当前是否在线
   * @param {String} appkey - appkey 
   * @param {String} id IM 用户 id
   * @return {Number} 返回用户是否在线   1 => 在线   0 => 不在线
   */
  async getContactIsOnLine(appkey, contactId) {
    const contactInfoResult = await ContactModel.getContactInfo(appkey, contactId);
    if (contactInfoResult.error) {
      return 0;
    }
    return contactInfoResult.result.state;
  }
}

module.exports = {
  ContactService: new ContactService(),
};
