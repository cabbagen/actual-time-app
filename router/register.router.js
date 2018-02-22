const registerController = require('../controller/register.controller.js').init();
const { registeRouter } = require('../common/applicationInit.js');

const routerMap = {
  post: {
    ['/uploadImg']: registerController.uploadImg.bind(registerController),
  }
};

module.exports = registeRouter(routerMap);
