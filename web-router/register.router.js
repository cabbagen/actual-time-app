const registerController = require('../controller/register.controller').init();
const baseController = require('../controller/base.controller').init();
const { registeRouter } = require('../kernel/core');

const routerMap = {
  post: {
    ['/uploadImg']: baseController.uploadImgFile.bind(baseController),
    ['/registeUser']: registerController.registeUser.bind(registerController),
  }
};

module.exports = registeRouter(routerMap);
