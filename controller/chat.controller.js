const mongoose = require('mongoose');
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
    const { appkey, id } = request.headers;
    
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

    return response.json({ state: 200, msg: null, data: data });
  }

  // 保存 IM 用户信息
  async saveContactInfo(request, response) {
    const { nickname, avator } = request.body;
    const { id, appkey } = request.headers;

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
    const { type = 1, search = '', pageIndex = 0, pageSize = 10 } = request.body;
    const { appkey, id } = request.headers;

    if (utils.checkType(appkey) !== 'String') {
      return response.json({ state: 201, msg: 'appkey 错误', data: null });
    }
    const queryConditionMap = {
      1: { $or: [{ nickname: { $regex: search }, _id: { $ne: mongoose.Types.ObjectId(id)} }, { username: { $regex: search }, _id: { $ne: mongoose.Types.ObjectId(id)} }] }, // 综合查询
      2: { nickname: { $regex: search }, _id: { $ne: mongoose.Types.ObjectId(id) } },  // nickname 查询
      3: { username: { $regex: search }, _id: { $ne: mongoose.Types.ObjectId(id) } },  // username 查询
    };

    const contactsResult = await ContactsModel.getContactInfos(appkey, queryConditionMap[type], pageIndex, pageSize);

    if (contactsResult.error !== null) {
      return response.json({ state: 203, msg: contactsResult.error, data: null });
    }

    return response.json({ state: 200, msg: null, data: contactsResult.result });
  }

  // 查询 IM 群组列表
  async getGroupInfos(request, response) {
    const { type = 1, search = '', pageIndex = 0, pageSize = 10 } = request.body;
    const { appkey } = request.headers;

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

  // 添加联系人好友
  async createContactFriend(request, response) {
    const { appkey } = request.headers;
    const { contactId, friendId } = request.body;

    const result = await ContactsModel.createContactFriend(appkey, contactId, friendId);

    response.json(result);
  }

  // 移除联系人好友
  async removeContactFriend(request, response) {
    const { appkey } = request.headers;
    const { contactId, friendId } = request.body;

    const result = await ContactsModel.removeContactFriend(appkey, contactId, friendId);

    response.json(result);
  }

  // 加入小组
  async contactJoinGroup(request, response) {
    const { groupId, contactId } = request.body;
    const { appkey } = request.headers;

    const result = await GroupsModel.createGroupMember(appkey, groupId, contactId);

    response.json(result);
  }

  // 离开小组
  async contactLeaveGroup(request, response) {
    const { groupId, contactId } = request.body;
    const { appkey } = request.headers;

    const result = await GroupsModel.removeGroupMember(appkey, groupId, contactId);

    response.json(result);
  }

  // 解散小组
  async disbandGroup(request, response) {
    const { groupId, contactId } = request.body;
    const { appkey } = request.headers;

    const result = await GroupsModel.disbandGroup(appkey, groupId, contactId);

    response.json(result);
  }
}

module.exports = ChatController;
