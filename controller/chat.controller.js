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

    return response.json({
      state: 200,
      msg: null,
      data: Object.assign({}, contactInfoResult.result._doc, {
        recentContacts: concactUnreadMessagesResult.result,
      }),
    })
  }

  // 保存用户信息
  async saveContactInfo(req, res) {
    const { id, appkey, nickname, avator } = req.body;

    if (typeof appkey === 'undefined' || appkey === '') {
      return this.returnAppKeyError(res);
    }
    if (typeof id === 'undefined' || id === '') {
      return this.returnParamsError(res, 'id 不能为空');
    }
    if (nickname === '' || avator === '') {
      return this.returnParamsError(res, '昵称和头像均不能为空');
    }

    const condition = { appkey, id };
    const updatedInfo = Object.assign({}, req.body, { avator: Config.webDomain + avator });
    const updateContaceResult = await ContactsModel.updateContactInfo(condition, updatedInfo);

    if (updateContaceResult.error) {
      return this.returnDatabaseError(res, '数据库操作失败');
    }

    return this.returnSuccess(res, updateContaceResult.result);
  }

  // 查询好友列表
  async getContactInfos(req, res) {
    const params = req.body;

    if (typeof params.appkey === 'undefined') {
      return this.returnAppKeyError(res);
    }

    const condition = params.search.trim() !== ''
      ? { [params.type]: params.search, appkey: params.appkey }
      : { appkey: params.appkey };

    const result = await ContactsModel.findAllByPagination(condition, params.pageIndex, params.pageSize);

    this.returnSuccess(res, result);
  }

  // 查询群组列表
  async getGroupInfos(req, res) {
    const params = req.body;

    if (typeof params.appkey === 'undefined') {
      return this.returnAppKeyError(res);
    }

    const condition = params.search.trim() !== ''
      ? { [params.type]: params.search, appkey: params.appkey }
      : { appkey: params.appkey };

    const result = await GroupsModel.findAllByPagination(condition, params.pageIndex, params.pageSize);

    this.returnSuccess(res, result);
  }

}

module.exports = ChatController;
