const adminController = require('../controller/admin.controller.js').init();
const { registeRouter } = require('../common/applicationInit.js');

const routerMap = {
  get: {
    ['/admin']: adminController.renderAdmin.bind(adminController),
  },
};

module.exports = registeRouter(routerMap);

