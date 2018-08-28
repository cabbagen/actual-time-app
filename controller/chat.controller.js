const BaseController = require('./base.controller.js');
const ContactsModel = require('../model/contacts.model.js');
const MessagesModel = require('../model/messages.model.js');
const utils = require('../providers/utils.provider.js');

class ChatController extends BaseController {

  static init() {
    return new ChatController();
  }

  constructor(props) {
    super(props);
    this.appkeyError = { state: 201, msg: '请传入 appkey', data: null };
    this.paramsError = { state: 202, msg: '传入的参数有误', data: null };
  }

  renderChat(req, res, next) {
    res.render('chat/chat');
  }

  // 获取联系人信息
  async getContactInfo(req, res) {
    const { appkey, id } = req.query;

    if (typeof appkey === 'undefined') return res.json(this.appkeyError);

    if (typeof id === 'undefined') return res.json(this.paramsError);

    const contactInfo = await ContactsModel.getContactInfo({ id, appkey }, {}, false);
    const recentContactInfos = await MessagesModel.getRecentContactInfos(id);

    if (!contactInfo || !recentContactInfos) {
      return res.json({ state: 203, msg: '获取信息失败', data: null });
    }

    const result = { ...contactInfo._doc, recentContacts: recentContactInfos };

    return res.json({ state: 200, msg: null, data: result });
  }

  // 查询 IM 用户列表

  // 查询 IM 群众列表
  
}

module.exports = ChatController;
