/**
 * 这里处理 chat socket 的部分服务, 这里尝试做成单例模式
 *
 * 命名空间: namespace => `chat`
 * 消息体结构: msg struct format => { type: [Number], content: [String], from: [String], to: [String] }
 * 相关类型说明:  
 * 
 *   type:     消息类型;    1 => 文本   2 => 图片
 *   content:  消息类型;    消息文本或者图片的 base64 码
 *   from:     消息发送人;  发送人的 objectId
 *   to:       消息接收人;  接收人的 objectId
 */

const mongoose = require('mongoose');
const MessageModel = require('../model/messages.model');
const ContactModel = require('../model/contacts.model');
const { callbackDecorator } = require('../kernel/core');
const { makeMD5Crypto } = require('../providers/utils.provider');

let chatApplication = null;  // this is a Singleton Pattern

class SocketChatService {

  static init(io) {
    chatApplication =  new SocketChatService(io);
  }

  constructor(io) {
    this.io = io;
    this.chat = null;
    this.registerChatService();
  }

  registerChatService() {
    this.chat = this.io.of(SocketChatService.socketPath).on('connection', (socket) => {
      // 连接 websocket IM 用户上线
      socket.on('on_line', (appkey, id) => {
        this.loginIMService(appkey, id);
      });

      // 推送未读消息 ...

      // 转发消息
    });
  }

  loginIMService(appkey, id) {
    const params = { appkey, id };
    return callbackDecorator(ContactModel.updateContaceInfo.bind(ContactModel), params, { status: 1 });
  }

}

SocketChatService.socketPath = '/chat';

SocketChatService.getChatApplication = function() {
  return chatApplication;
}

module.exports = { SocketChatService };
