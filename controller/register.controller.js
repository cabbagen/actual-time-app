const BaseController = require('./base.controller.js');
const UsersModel = require('../model/users.model.js').init();
const utilProvider = require('../providers/utils.provider.js');

class RegisterController extends BaseController {

  static init() {
    return new RegisterController();
  }

  async registeUser(req, res) {
    const { avatorImg, ...userInfo } = req.body;

    if (!utilProvider.checkWebsiteAddress(userInfo.email)) {
      return res.json({ status: 500, msg: '请输入正确的网址!', data: null });
    }

    const existedUserInfo = await UsersModel.getUserInfoByUserName(userInfo.username);

    if (existedUserInfo) {
      return res.json({ status: 500, msg: '用户已存在', data: null });
    }

    const { result, error } = await UsersModel.createUser(userInfo);

    if (!result) {
      return res.json({ tatus: 500, msg: error, data: null });
    }

    res.redirect('/index');
  }
}

module.exports = RegisterController;
