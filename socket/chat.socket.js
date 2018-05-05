/**
 * 这里处理 chat socket 的部分服务
 *
 * namespace => `chat` 
 * 
 */
class SocketChatService {

  static init(io) {
    return new SocketChatService(io);
  }

  constructor(io) {
    this.io = io;
    this.chat = null;
    this.registerChatService();
  }

  registerChatService() {
    this.chat = this.io.of(SocketChatService.socketPath).on('connection', function(socket) {
      socket.on('chat', function(data) {
        console.log(data);
      });
      socket.emit('demo', 'hello client');
    });
  }
}

SocketChatService.socketPath = '/chat';

module.exports = { SocketChatService };
