
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
    });
  }
}

SocketChatService.socketPath = '/chat';


// function chatServiceRegister(io) {
//   var chat = io.of('/chat').on('connection', function (socket) {
//     socket.emit('a message', {
//         that: 'only',
//         '/chat': 'will get'
//     });
//     chat.emit('a message', {
//         everyone: 'in',
//         '/chat': 'will get'
//     });
//   });
// }

module.exports = { SocketChatService };
