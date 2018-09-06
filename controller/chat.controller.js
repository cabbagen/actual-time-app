const BaseController = require('./base.controller');
const ContactsModel = require('../model/contacts.model').init();
const MessagesModel = require('../model/messages.model').init();
const Config = require('../config/config');

class ChatController extends BaseController {

  static init() {
    return new ChatController();
  }

  constructor(props) {
    super(props);
  }

  renderChat(req, res) {
    res.render('chat/chat');
  }

  // 获取联系人信息
  async getContactInfo(req, res) {
    const { appkey, id } = req.query;

    if (typeof appkey === 'undefined') {
      return this.returnAppKeyError(res);
    }

    if (typeof id === 'undefined') {
      return this.returnParamsError(res, 'id 不能为空');
    }

    const contactInfo = await ContactsModel.getContactRelatedInfo({ id, appkey }, {}, false);
    const recentContactInfos = await MessagesModel.getRecentContactMessages(id);

    if (!contactInfo || !recentContactInfos) {
      return this.returnDatabaseError(res, '数据库获取信息失败');
    }

    const result = { ...contactInfo._doc, recentContacts: recentContactInfos };

    return this.returnSuccess(res, result);
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
  
}

module.exports = ChatController;
