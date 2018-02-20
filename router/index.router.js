const indexController = require('../controller/index.controller.js').init();
const chatController = require('../controller/chat.controller.js').init();
const { registeRouter } = require('../common/applicationInit.js');

const routerMap = {
  get: {
    ['/index']: indexController.renderIndex.bind(indexController),
    ['/chat']: chatController.renderChat.bind(chatController),
    ['/getCaptcha']: indexController.getCaptcha.bind(indexController),
    ['/register']: indexController.renderRegister.bind(indexController),
  },
  post: {
    ['/login']: indexController.login.bind(indexController),
  }
};

module.exports = registeRouter(routerMap);

