const registerController = require('../controller/register.controller.js').init();
const { registeRouter } = require('../kernel/core.js');

const routerMap = {
  post: {
    ['/uploadImg']: registerController.uploadImg.bind(registerController),
    ['/registeUser']: registerController.registeUser.bind(registerController),
  }
};

module.exports = registeRouter(routerMap);
