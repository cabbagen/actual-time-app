const BaseController = require('./base.controller.js');
const ContactsModel = require('../model/contacts.model.js');
const MessagesModel = require('../model/messages.model.js');
const { callbackDecorator } = require('../kernel/core.js');
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
  getContactInfo(req, res) {
    const { appkey, id } = req.query;

    if (typeof appkey === 'undefined') return res.json(this.appkeyError);

    if (typeof id === 'undefined') return res.json(this.paramsError);

    callbackDecorator(ContactsModel.getContactInfo.bind(ContactsModel), { id, appkey }, {}, false)
      .then(function(data) {
        return res.json({ state: 200, msg: null, data });
      })
      .catch(function(error) {
        return res.json({ state: 203, msg: error.toString(), data: null });
      });
  }

}

module.exports = ChatController;
