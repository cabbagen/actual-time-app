/**
 * 这里处理 chat socket 的部分服务
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

class SocketChatService {

  static init(io) {
    return new SocketChatService(io);
  }

  constructor(io) {
    this.io = io;
    this.chat = null;
    this.registerChatService();
    this.onlineMembers = [];
    this.channelRooms = [];
  }

  registerChatService() {
    this.chat = this.io.of(SocketChatService.socketPath).on('connection', (socket) => {
      // 登录
      socket.on('chat_init', (appkey, data) => {
        this.loginIMLine(data.from);
      });

      // 私聊
      socket.on('chat_private', (appkey, data) => {
        this.handleChatFromPrivate(appkey, data, socket);
      });

      // 群聊
    });
  }

  loginIMLine(id) {
    const isOnLined = this.isOnLined(id);
    if (!isOnLined) this.onlineMembers.push(id);
  }

  isOnLined(id) {
    return this.onlineMembers.indexOf(id) > -1;
  }

  handleChatFromPrivate(appkey, data, chatSocket) {
    const isOnLined = this.isOnLined(data.to);
    const params = {
      msg_type: data.type,
      msg_state: isOnLined ? 1 : 0,
      msg_from_group: null,
      msg_content: data.content,
      msg_from_contact: mongoose.Types.ObjectId(data.from),
      msg_to_contact: mongoose.Types.ObjectId(data.to),
      appkey: appkey,
    };

    callbackDecorator(MessageModel.addMessage.bind(MessageModel), params)
      .then((result) => {
        const condition = { _id: mongoose.Types.ObjectId(result._id) };
        return callbackDecorator(MessageModel.getOneMessage.bind(MessageModel), condition);
      })
      .then((result) => {
        // 消息广播
        const hasPrivateChannelRoom = this.hasPrivateChannelRoom(data.from, data.to);

        const room = makeMD5Crypto(data.from + data.to);

        if (!hasPrivateChannelRoom) this.createChannelRoom('private', room);

        const currenRoom = this.getCurrentPrivateChannelRoom(data.from, data.to);

        const beSentMsg = {
          type: data.type,
          content: data.content,
          from: result.msg_from_contact,
          to: result.msg_to_contact,
        };

        chatSocket.join(currenRoom.room, () => {
          chatSocket.emit('chat_private', beSentMsg).to(currenRoom.room).broadcast.emit('chat_private', beSentMsg);
        });
      });
  }

  hasPrivateChannelRoom(from, to) {
    const room = makeMD5Crypto(from + to);
    const reverseRoom = makeMD5Crypto(to + from);

    return this.hasChannelRoom(room) || this.hasChannelRoom(reverseRoom);
  }

  hasChannelRoom(room) {
    return this.channelRooms.find(roomInfo => roomInfo.room === room);
  }

  /**
   * 创建 room 通道
   * @param {string} type 通道 room 类型 private || public
   * @param {string} room 通道 room 名称
   */
  createChannelRoom(type, room) {
    this.channelRooms.push({ type, room });
  }

  getCurrentPrivateChannelRoom(from, to) {
    const room = makeMD5Crypto(from + to);
    const reverseRoom = makeMD5Crypto(to + from);

    return this.channelRooms.find((roomInfo) => {
      return roomInfo.type === 'private' && (roomInfo.room === room || roomInfo.room === reverseRoom);
    });
  }

}

SocketChatService.socketPath = '/chat';

module.exports = { SocketChatService };
