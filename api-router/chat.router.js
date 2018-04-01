const chatController = require('../controller/chat.controller.js').init();
const authMiddleware = require('../middleware/auth.middleware.js');
const { registeRouter } = require('../common/applicationInit.js');

const routerMap = {
  get: {
    ['/chatDemo']: [ authMiddleware(), chatController.renderChat.bind(chatController) ],
    ['/getContacts']: chatController.getContacts.bind(chatController),
    ['/getMessages']: chatController.getMessages.bind(chatController),
  },
  post: {
    ['/addContacts']: chatController.addContacts.bind(chatController),    
  },
};

module.exports = registeRouter(routerMap);