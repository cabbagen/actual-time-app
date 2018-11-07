const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const contactsSchema = require('../schema/contacts.schema');
const utils = require('../providers/utils.provider');

class ContactsModel extends BaseModel {

  static init() {
    return new ContactsModel();
  }

  constructor(props) {
    super(props);
    this.contactsModel = mongoose.model('contacts', contactsSchema);
  }

  /**
   * 创建联系人
   * @param {String} appkey 
   * @param {Any[]} contactInfo 
   */
  async createContactInfos(appkey, contactInfos) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactInfos) !== 'Array') {
      return { result: null, error: this.paramsError };
    }
    const realContactInfos = contactInfos.map((contactInfo) => {
      return Object.assign({}, contactInfo, { appkey });
    });

    return this.contactsModel.create(realContactInfos).then(this.resolve).catch(this.reject);
  }

  /**
   * 通过 ID 删除联系人
   * @param {String} appkey 
   * @param {String[]} contactIds 
   */
  async removeContactInfos(appkey, contactIds) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactInfos) !== 'Array') {
      return { result: null, error: this.paramsError };
    }

    const realContactIds = contactIds.map((contactId) => mongoose.Types.ObjectId(contactId));

    const condition = { _id: { $in: realContactIds }, appkey };

    return this.contactsModel.deleteMany(condition).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 获取联系人信息
   * @param {String} appkey 
   * @param {String} contactId 
   */
  async getContactInfo(appkey, contactId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const condition = { appkey, _id: mongoose.Types.ObjectId(contactId) };

    return this.contactsModel.findOne(condition).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 获取联系人相关的信息
   * @param {String} appkey 
   * @param {String} contactId 
   */
  async getContactRelatedInfo(appkey, contactId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const condition = { appkey, _id: mongoose.Types.ObjectId(contactId) };

    return this.contactsModel.findOne(condition).populate('friends').populate('groups').exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 更新联系人信息
   * @param {String} appkey 
   * @param {String} contactId 
   * @param {Object} updatedInfo 
   */
  async updateContactInfo(appkey, contactId, updatedInfo) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String' || utils.checkType(updatedInfo) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    const condition = { _id: mongoose.Types.ObjectId(contactId), appkey };
    return this.contactsModel.update(condition, updatedInfo).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 通过 socketId 来进行上下线处理
   * @param {String} socketId - 链接 socket.io 时分配的 socketId
   * @param {Number} state - 用户的上下线状态
   * @return {Object} 更新结果
   */
  async setContactStatusBySocketId(socketId, state) {
    if (typeof socketId === 'undefined') {
      return { result: null, error: this.paramsError };
    };

    return this.contactsModel.update({ socket_id: socketId }, { state }).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 获取联系人列表
   * @param {String} appkey
   * @param {Object} condition - 关键字
   * @param {Number} pageIndex - 从 0 开始
   * @param {Number} pageSize
   */
  async getContactInfos(appkey, condition, pageIndex = 0, pageSize = 10) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(condition) !== 'Object' || utils.checkType(pageIndex) !== 'Number' || utils.checkType(pageSize) !== 'Number') {
      return { result: null, error: this.paramsError };
    }

    const realContidion = Object.assign({}, { appkey }, condition);
    const contactsResult = await this.contactsModel.find(realContidion).skip(pageIndex * pageSize).limit(pageSize).exec().then(this.resolve).catch(this.reject);
    const totalResult = await this.contactsModel.find(realContidion).count().exec().then(this.resolve).catch(this.reject);

    if (contactsResult.error || totalResult.error) {
      return contactsResult.error ? contactsResult : totalResult;
    }

    const result = {
      error: null,
      result: { total: totalResult.result, contacts: contactsResult.result },
    };

    return new Promise((resolve) => {
      return resolve(result);
    });
  }

}

module.exports = ContactsModel;
