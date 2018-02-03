const usersModel = require('../model/users.model.js');

class BaseController {
  
  constructor() {

  }

  *isLogined() {
    const userInfo = yield usersModel.find({ username: "xia" }).exec();
    return typeof userInfo !== 'undefined';
  }

}

module.exports = BaseController;