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

const { ContactService } = require('./chat.contacts');
const { MessageService } = require('./chat.messages');
const { ChannelService } = require('./chat.channels');

const eventCenter = {
  connection: 'connection',
  online: 'on_line',
  disconnecting: 'disconnecting',
  private: 'chat_private',
};


// it will be a Singleton
let chatApplication = null;

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
    this.chat = this.io.of(SocketChatService.socketPath).on(eventCenter.connection, (socket) => {
      // 连接 websocket IM 用户上线
      socket.on(eventCenter.online, (appkey, id) => {
        ContactService.loginIMService(appkey, id, socket.client.id);
      });

      // 断开 websocket 连接
      socket.on(eventCenter.disconnecting, () => {
        ContactService.logoutIMService(socket.client.id);
      });

      // 处理单聊消息
      socket.on(eventCenter.private, (appkey, data) => {
        this.handlePrivateMessage(appkey, data).then((message) => {
          return MessageService.getMessageInfoByMessageId(message._id);
        })
        .then((message) => {
          this.broadcastMessage(socket, message);
        })
        .catch((error) => {
          console.log('chat_private error: ', error);
        });
      });
    });
  }

  handlePrivateMessage(appkey, messageParmas) {
    return ContactService.getContactIsOnLine(appkey, messageParmas.target).then((result) => {
      const targetState = result.state;
      ChannelService.createIMChannel(appkey, targetState, messageParmas.source, messageParmas.target)
      return targetState;
    })
    .then((targetState) => {
      return MessageService.saveIMMessage(appkey, targetState, 2, messageParmas);
    });
  }

  broadcastMessage(chatSocket, messageInfo) {
    const source = messageInfo.message_source._id;
    const target = messageInfo.message_target._id;

    ChannelService.getChannelInfoBySourceIdAndTargetId(source, target).then((result) => {
      chatSocket.join(result.channel_id, () => {
        chatSocket
          .emit('chat_private', messageInfo)
          .to(result.channel_id)
          .broadcast
          .emit('chat_private', messageInfo);
      });
    });
  }
}

SocketChatService.socketPath = '/chat';

SocketChatService.getChatApplication = function() {
  return chatApplication;
}

module.exports = { SocketChatService };
