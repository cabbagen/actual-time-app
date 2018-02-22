const BaseController = require('./base.controller.js');
const UsersModel = require('../model/users.model.js');

class RegisterController extends BaseController {

  static init() {
    return new RegisterController();
  }

  registerUser(req, res) {

  }
}

module.exports = RegisterController;
