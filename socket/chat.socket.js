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

const MessageModel = require('../model/messages.model');
const ContactModel = require('../model/contacts.model');
const { callbackDecorator } = require('../kernel/core');

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
        console.log('IM 用户上线');
        this.loginIMService(appkey, id, socket.client.id);
      });

      // 断开连接
      socket.on('disconnecting', (reason) => {
        console.log('IM 用户下线');
        this.logoutIMService(socket.client.id);
      });

      // 推送未读消息 ...

      // 转发消息 ...

    });
  }

  loginIMService(appkey, id, socketId) {
    const params = { appkey, id };
    const updatedParams = { state: 1, socket_id: socketId };

    return callbackDecorator(ContactModel.updateContaceInfo.bind(ContactModel), params, updatedParams);
  }

  logoutIMService(socketId) {
    const updatedParams = { state: 0 };
    return callbackDecorator(ContactModel.changeContactStatusBySocketId.bind(ContactModel), socketId, updatedParams);
  }

  getIMServiceUnreadMessage(target) {
    const params = {
      message_target: target,
      message_state: 0,
    };
    callbackDecorator(MessageModel.getMessages.bind(MessageModel), params).then((result) => {
      return result;
    }, (error) => {
      console.log(error.toString());
    });
  }
}

SocketChatService.socketPath = '/chat';

SocketChatService.getChatApplication = function() {
  return chatApplication;
}

module.exports = { SocketChatService };
