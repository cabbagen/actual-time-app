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
    this.appKeyError = { state: 201, msg: '请传入 appKey', data: null };
    this.paramsError = { state: 202, msg: '传入的参数有误', data: null };
  }

  renderChat(req, res, next) {
    res.render('chat/chat');
  }

  /**
   * 查询 IM 用户列表
   * 
   * Method => 'GET'
   * 查询参数对象，format: { appKey: [String], groupId: [?Number] }
   */
  getContacts(req, res) {
    const { appKey, groupId } = req.query;

    if (typeof appKey === 'undefined') {
      return res.json(this.appKeyError);
    }

    if (typeof groupId !== 'undefined' && (!parseInt(groupId, 10) || parseInt(groupId, 10) <= 0)) {
      return res.json(this.paramsError);
    }

    ContactsModel.getContacts({ appKey, groupId }, (error, data) => {
      if (error) {
        return res.json({ state: 203, msg: error.toString(), data: null });
      }
      return res.json({ state: 200, msg: null, data });
    });
  }

  /**
   * 批量导入 IM 用户
   * 
   * Method: POST
   * 参数: contacts 数据格式 format: --- Array ---
   * 
   * username: [String], nickname: [String], avator: [String]
   * gender: [Number], email: [String], appKey: [String]
   */
  addContacts(req, res) {
    const parmas = req.body.contacts;
    if (typeof parmas === 'undefined' || utils.checkType(parmas) !== 'Array') {
      return res.json(this.paramsError);
    }

    ContactsModel.addContacts(parmas, (error, data) => {
      if (error) {
        return res.json({ state: 203, msg: error.toString(), data: null });
      }
      return res.json({ state: 200, msg: null, data });
    });
  }

  /**
   * 获取指定的 IM 用户信息
   * 
   * Method: 'GET'
   * 查询参数对象，format: { appKey: [String], username: [String] }
   */
  getContactInfo(req, res) {
    const { appKey, username } = req.query;
    if (typeof appKey === 'undefined' || typeof username === 'undefined') {
      return res.json(this.paramsError);
    }

    ContactsModel.getContactInfo({ appKey, username }, (error, data) => {
      if (error) {
        return res.json({ state: 203, msg: error.toString(), data: null });
      }
      return res.json({ state: 200, msg: null, data });
    });
  }

  getMessages(req, res) {
    const content = '这是一条消息';
    MessagesModel.getMessages({ content }, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        res.json(data);
      }
    });
  }



}

module.exports = ChatController;