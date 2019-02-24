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
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactIds) !== 'Array') {
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
   * @param {Object} condition 
   * @param {Object} updatedInfo 
   */
  async updateContactInfo(appkey, condition, updatedInfo) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(condition) !== 'Object' || utils.checkType(updatedInfo) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    const realCondition = Object.assign({}, condition, { appkey });
    return this.contactsModel.update(realCondition, updatedInfo).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 不安全地更新联系人信息
   * 仅限内部使用
   * @param {Object} condition 
   * @param {Object} updatedInfo 
   */
  async unsafeUpdateContactInfo(condition, updatedInfo) {
    if (utils.checkType(condition) !== 'Object' || utils.checkType(updatedInfo) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    return this.contactsModel.update(condition, updatedInfo).exec().then(this.resolve).catch(this.reject);
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

  /**
   * 添加联系人好友
   * @param {String} appkey 
   * @param {String} contactId 
   * @param {String} friendId 
   */
  async createContactFriend(appkey, contactId, friendId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String' || utils.checkType(friendId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const contactResult = await this.contactsModel
      .update({ appkey, _id: mongoose.Types.ObjectId(contactId) }, { $push: { friends: mongoose.Types.ObjectId(friendId) } })
      .exec().then(this.resolve).catch(this.reject);

    if (contactResult.error) {
      return contactResult;
    }

    const friendResult = await this.contactsModel
      .update({ appkey, _id: mongoose.Types.ObjectId(friendId) }, { $push: { friends: mongoose.Types.ObjectId(contactId) } })
      .exec().then(this.resolve).catch(this.reject);

    if (friendResult.error) {

      // 回退上面的操作
      if (!contactResult.error) {
        await this.contactsModel
          .update({ appkey, _id: mongoose.Types.ObjectId(contactId) }, { $pop: { friends: 1 } })
          .exec().then(this.resolve).catch(this.reject);
      }

      return friendResult;
    }

    return { result: 'ok', error: null };
  }

  /**
   * 移除联系人好友
   * @param {String} appkey 
   * @param {String} contactId 
   * @param {String} friendId 
   */
  async removeContactFriend(appkey, contactId, friendId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String' || utils.checkType(friendId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const contactResult = await this.contactsModel
      .update({ appkey, _id: mongoose.Types.ObjectId(contactId) }, { $pull: { friends: mongoose.Types.ObjectId(friendId) } })
      .exec().then(this.resolve).catch(this.reject);

    if (contactResult.error) {
      return contactResult;
    }

    const friendResult = await this.contactsModel
      .update({ appkey, _id: mongoose.Types.ObjectId(friendId) }, { $pull: { friends: mongoose.Types.ObjectId(contactId) } })
      .exec().then(this.resolve).catch(this.reject);

    if (friendResult.error) {

      // 回退上面的操作
      if (!contactResult.error) {
        await this.contactsModel
          .update({ appkey, _id: mongoose.Types.ObjectId(contactId) }, { $push: { friends: mongoose.Types.ObjectId(friendId) } })
          .exec().then(this.resolve).catch(this.reject);
      }

      return friendResult;
    }

    return { result: 'ok', error: null };
  }
}

module.exports = ContactsModel;
