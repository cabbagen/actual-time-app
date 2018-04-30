const adminController = require('../controller/admin.controller.js').init();
const { registeRouter } = require('../kernel/core.js');

const routerMap = {
  get: {
    ['/admin']: adminController.renderAdmin.bind(adminController),
  },
};

module.exports = registeRouter(routerMap);

