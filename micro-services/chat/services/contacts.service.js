
/**
 * contacts service
 * 提供 im contacts 的相关操作
 */
const mongoose = require('mongoose');
const ContactModel = require('../../../model/contacts.model').init();

class ContactsService {

  /**
   * 当用户登录 IM 服务时
   * 需要更改用户为 上线 的状态 同时 也需要更新 socketId 字段
   * 用户的离线消息也需要在这个时候推送
   * 
   * @param {String} appkey 
   * @param {String} contactId 
   * @param {String} socketId 
   */
  async loginIMService(appkey, contactId, socketId) {
    const condition = { _id: mongoose.Types.ObjectId(contactId) };
    const updatedInfo = { state: 1, socket_id: socketId };

    ContactModel.updateContactInfo(appkey, condition, updatedInfo);
  }

  /**
   * 当用户断开 IM 服务时
   * 这时候拿不到 appkey 只能通过 socketId 将用户 置为 下线状态
   * @param {String} socketId 
   */
  async logoutIMService(socketId) {
    ContactModel.unsafeUpdateContactInfo({ socket_id: socketId }, { state: 0 });
  }

  /**
   * 判断当前 IM 用户是否在线
   * @param {String} appkey 
   * @param {String} contactId 
   */
  async getContactIsOnLine(appkey, contactId) {
    const contactInfoResult = await ContactModel.getContactInfo(appkey, contactId);

    if (contactInfoResult.error) {
      return false;
    }
    return contactInfoResult.result.state === 1;
  }
}

module.exports = {
  ContactsService: new ContactsService(),
}
