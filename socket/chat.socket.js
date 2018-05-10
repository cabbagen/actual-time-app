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
      socket.on('chat_init', (appKey, data) => {
        this.onLine(data.from);
      });

      // 私聊
      socket.on('chat_private', (appKey, data) => {
        this.handleChatFromPrivate(appKey, data, socket);
      });

      // 群聊
    });
  }

  onLine(id) {
    const isOnLined = this.isOnLined();
    if (!isOnLined) this.onlineMembers.push(id);
  }

  isOnLined(id) {
    return this.onlineMembers.indexOf(id) > -1;
  }

  handleChatFromPrivate(appKey, data, chatSocket) {
    const isOnLined = this.isOnLined(data.to);
    const params = {
      msg_type: data.type,
      msg_state: isOnLined ? 1 : 0,
      msg_from_group: null,
      msg_content: data.content,
      msg_from_contact: mongoose.Types.ObjectId(data.from),
      msg_to_contact: mongoose.Types.ObjectId(data.to),
      app_key: appKey,
    };

    MessageModel.addMessage(params, function(error) {
      if (!error) console.log(error);
    });

    // 消息广播
    const hasPrivateChannelRoom = this.hasPrivateChannelRoom(data.from, data.to);
    const room = makeMD5Crypto(data.from + data.to);

    if (!this.hasChannelRoom) this.createChannelRoom('private', room);
    chatSocket.join(room).emit('chat_private', data);
  }

  /**
   * 创建 room 通道
   * @param {string} type 通道 room 类型 private || public
   * @param {string} room 通道 room 名称
   */
  createChannelRoom(type, room) {
    this.channelRooms.push({ type, room });
  }

  hasPrivateChannelRoom(from, to) {
    const room = makeMD5Crypto(data.from + data.to);
    const reverseRoom = makeMD5Crypto(data.to + data.from);

    return this.hasChannelRoom(room) || this.hasChannelRoom(reverseRoom);
  }

  hasChannelRoom(room) {
    return this.channelRooms.find(roomInfo => roomInfo.room === room);
  }

}

SocketChatService.socketPath = '/chat';

module.exports = { SocketChatService };
