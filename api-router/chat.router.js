const chatController = require('../controller/chat.controller.js').init();
const authMiddleware = require('../middleware/auth.middleware.js');
const { registeRouter } = require('../kernel/core.js');

const routerMap = {
  get: {
    ['/chatDemo']: [ authMiddleware(), chatController.renderChat.bind(chatController) ],
    ['/getContactInfo']: chatController.getContactInfo.bind(chatController),
  },
  post: {
  },
};

module.exports = registeRouter(routerMap);
