const BaseController = require('./base.controller');
const ContactsModel = require('../model/contacts.model').init();
const MessagesModel = require('../model/messages.model').init();
const GroupsModel = require('../model/groups.model').init();
const utils = require('../providers/utils.provider');

const Config = require('../config/config');

class ChatController extends BaseController {

  static init() {
    return new ChatController();
  }

  renderChat(request, response) {
    return response.render('chat/chat');
  }

  // 获取 IM 用户相关信息
  async getContactInfo(request, response) {
    const { appkey, id } = request.query;
    
    if (utils.checkType(appkey) !== 'String') {
      return response.json({ state: 201, msg: 'appkey 错误', data: null });
    }
    if (utils.checkType(id) !== 'String') {
      return response.json({ state: 202, msg: 'id 参数错误', data: null });
    }

    const contactInfoResult = await ContactsModel.getContactRelatedInfo(appkey, id);
    const concactUnreadMessagesResult = await MessagesModel.getContactUnReadMessages(appkey, id);

    if (contactInfoResult.error !== null || concactUnreadMessagesResult.error !== null) {
      return response.json({
        state: 203,
        data: null,
        msg: contactInfoResult.error || concactUnreadMessagesResult.error,
      });
    }

    const data = Object.assign({}, contactInfoResult.result._doc, {
      recentContacts: concactUnreadMessagesResult.result,
    });

    return response.json({ state: 200, msg: null, data });
  }

  // 保存 IM 用户信息
  async saveContactInfo(request, response) {
    const { id, appkey, nickname, avator } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json({ state: 201, msg: 'appkey 错误', data: null });
    }

    if (utils.checkType(id) !== 'String' || utils.checkType(nickname) !== 'String' || utils.checkType(avator) !== 'String') {
      return response.json({ state: 202, msg: '参数传递错误', data: null });
    }

    const document = { nickname, avator: Config.webDomain + avator };
    const updateContactResult = await ContactsModel.updateContactInfo(appkey, id, document);

    if (updateContactResult.error !== null) {
      return response.json({ state: 203, msg: updateContactResult.error, data: null });
    }

    return response.json({ state: 200, msg: null, data: updateContactResult.result });
  }

  // 查询 IM 用户列表
  async getContactInfos(request, response) {
    const { appkey, type = 1, search = '', pageIndex = 0, pageSize = 10 } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json({ state: 201, msg: 'appkey 错误', data: null });
    }
    const queryConditionMap = {
      1: { $or: [{ nickname: { $regex: search } }, { username: { $regex: search } }] }, // 综合查询
      2: { nickname: { $regex: search } },  // nickname 查询
      3: { username: { $regex: search } },  // username 查询
    };

    const contactsResult = await ContactsModel.getContactInfos(appkey, queryConditionMap[type], pageIndex, pageSize);

    if (contactsResult.error !== null) {
      return response.json({ state: 203, msg: contactsResult.error, data: null });
    }

    return response.json({ state: 200, msg: null, data: contactsResult.result });
  }

  // 查询 IM 群组列表
  async getGroupInfos(request, response) {
    const { appkey, type = 1, search = '', pageIndex = 0, pageSize = 10 } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json({ state: 201, msg: 'appkey 错误', data: null });
    }
    const queryConditionMap = {
      1: { group_name: { $regex: search } },  // 根据 group_name 查询
    };
    const groupsResult = await GroupsModel.getGroupInfos(appkey, queryConditionMap[type], pageIndex, pageSize);

    if (groupsResult.error !== null) {
      return response.json({ state: 203, msg: groupsResult.error, data: null });
    }

    return response.json({ state: 200, msg: null, data: groupsResult.result });
  }
}

module.exports = ChatController;
