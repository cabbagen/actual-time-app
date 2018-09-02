const { EventCenter } = require('./events/chat.event');
const { registEventHandle } = require('./handles/handle.events');

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
    this.chat = this.io
      .of(SocketChatService.socketPath)
      .on(EventCenter.im_connection, (socket) => {
        registEventHandle(socket);
      });
  }
}

SocketChatService.socketPath = '/chat';

SocketChatService.getChatApplication = function() {
  return chatApplication;
}

module.exports = { SocketChatService };
