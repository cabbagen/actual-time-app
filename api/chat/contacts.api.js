const BaseApiController = require('../base.api');
const ContacstModel = require('../../model/contacts.model').init();
const MessagesModel = require('../../model/messages.model').init();
const utils = require('../../providers/utils.provider');

class ContactsApiController extends BaseApiController {

  static init() {
    return new ContactsApiController();
  }

  // 批量添加IM用户
  async createContactInfos(request, response) {
    const { appkey, contactInfos } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(contactInfos) !== 'Array') {
      return response.json(this.exceptions['1002']);
    }

    const result = await ContacstModel.createContactInfos(appkey, contactInfos);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(this.exceptions['1000']);
  }

  // 删除联系人
  async removeContactInfos(request, response) {
    const { appkey, contactIds } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(contactIds) !== 'Array') {
      return response.json(this.exceptions['1002']);
    }

    const result = await ContacstModel.removeContactInfos(appkey, contactIds);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(this.exceptions['1000']);
  }

  // 获取联系人详细信息
  async getContactInfo(request, response) {
    const { appkey, contactId } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(contactId) !== 'String') {
      return response.json(this.exceptions['1002']);
    }

    const result = await ContacstModel.getContactInfo(appkey, contactId);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(Object.assign({}, this.exceptions['1000'], { data: result.result }));
  }

  // 获取联系人详细信息
  async getContactRelatedInfo(request, response) {
    const { appkey, contactId } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(contactId) !== 'String') {
      return response.json(this.exceptions['1002']);
    }

    const result = await ContacstModel.getContactRelatedInfo(appkey, contactId);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(Object.assign({}, this.exceptions['1000'], { data: result.result }));
  }

  /**
   * 获取联系人列表
   * @param {Object} request - keyword、pageSize、pageNo、type
   * @param {Object} response 
   */
  async getContactInfos(request, response) {
    const { appkey, keyword = '', pageSize = 10, pageIndex = 0, type = 0 } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }
    
    const conditionMap = {
      0: { $or: [{ username: { $regex: keyword }}, { nickname: { $regex: keyword } }] },
      1: { username: { $regex: keyword } },
      2: { nickname: { $regex: keyword } },
    };
    const result = await ContacstModel.getContactInfos(appkey, conditionMap[type], pageIndex, pageSize);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(Object.assign({}, this.exceptions['1000'], { data: result.result }));
  }

  // 更新联系人信息
  async updateContactInfo(request, response) {
    const { appkey, contactId, updatedInfo } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(contactId) !== 'String' || utils.checkType(updatedInfo) !== 'Object') {
      return response.json(this.exceptions['1002']);
    }

    const result = await ContacstModel.updateContactInfo(appkey, contactId, updatedInfo);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(this.exceptions['1000']);
  }

  // 获取 IM 用户 未读消息
  async getContactUnReadMessages(request, response) {
    const { appkey, contactId } = request.body;
    
    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(contactId) !== 'String') {
      return response.json(this.exceptions['1002']);
    }

    const result = await MessagesModel.getContactUnReadMessages(contactId);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(Object.assign({}, this.exceptions['1000'], { data: result.result }));
  }
}

module.exports = ContactsApiController;
