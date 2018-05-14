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
    this.appkeyError = { state: 201, msg: '请传入 appKey', data: null };
    this.paramsError = { state: 202, msg: '传入的参数有误', data: null };
  }

  renderChat(req, res, next) {
    res.render('chat/chat');
  }

  // 获取群组内联系人
  // getContacts(req, res) {
  //   const { appKey, groupId } = req.query;

  //   if (typeof appKey === 'undefined') {
  //     return res.json(this.appKeyError);
  //   }

  //   if (typeof groupId !== 'undefined' && (!parseInt(groupId, 10) || parseInt(groupId, 10) <= 0)) {
  //     return res.json(this.paramsError);
  //   }

  //   callbackDecorator(ContactsModel.getContacts.bind(ContactsModel), { appKey, groupId })
  //     .then(function(data) {
  //       return res.json({ state: 200, msg: null, data });
  //     })
  //     .catch(function(error) {
  //       return res.json({ state: 203, msg: error.toString(), data: null });
  //     });
  // }

  // 向系统导入联系人信息
  // addContacts(req, res) {
  //   const parmas = req.body.contacts;
  //   if (typeof parmas === 'undefined' || utils.checkType(parmas) !== 'Array') {
  //     return res.json(this.paramsError);
  //   }

  //   callbackDecorator(ContactsModel.addContacts.bind(ContactsModel), parmas)
  //     .then(function(data) {
  //       return res.json({ state: 200, msg: null, data });
  //     })
  //     .catch(function(error) {
  //       return res.json({ state: 203, msg: error.toString(), data: null });
  //     });
  // }

  // 获取联系人信息
  getContactInfo(req, res) {
    const { appkey, id } = req.query;

    if (typeof appkey === 'undefined' || typeof id === 'undefined') {
      return res.json(this.paramsError);
    }

    callbackDecorator(ContactsModel.getContactInfo.bind(ContactsModel), { id, appkey })
      .then(function(data) {
        return res.json({ state: 200, msg: null, data });
      })
      .catch(function(error) {
        return res.json({ state: 203, msg: error.toString(), data: null });
      });
  }

  // 获取聊天信息
  // getMessages(req, res) {
  //   res.end('获取聊天信息');
  // }
}

module.exports = ChatController;
