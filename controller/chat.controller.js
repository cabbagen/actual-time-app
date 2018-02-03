const BaseController = require('./base.controller.js');

class ChatController extends BaseController {

  static init() {
    return new ChatController();
  }

  renderChat(req, res, next) {
    res.render('chat/chat');
  }
}

module.exports = ChatController;