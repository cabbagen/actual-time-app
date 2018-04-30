const indexController = require('../controller/index.controller.js').init();
const { registeRouter } = require('../kernel/core.js');

const routerMap = {
  get: {
    ['/index']: indexController.renderIndex.bind(indexController),
    ['/chat']: indexController.renderChat.bind(indexController),
    ['/getCaptcha']: indexController.getCaptcha.bind(indexController),
    ['/register']: indexController.renderRegister.bind(indexController),
  },
  post: {
    ['/login']: indexController.login.bind(indexController),
  }
};

module.exports = registeRouter(routerMap);

