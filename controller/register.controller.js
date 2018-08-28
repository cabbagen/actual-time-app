const BaseController = require('./base.controller.js');
const UsersModel = require('../model/users.model.js');
const utilProvider = require('../providers/utils.provider.js');

class RegisterController extends BaseController {

  static init() {
    return new RegisterController();
  }

  registeUser(req, res) {
    const { avatorImg, ...userInfo } = req.body;

    if (!utilProvider.checkWebsiteAddress(userInfo.email)) {
      return res.json({ status: 500, msg: '请输入正确的网址!', data: null });
    }

    UsersModel.findOne({ username }).exec()
      .then(data => !!data)
      .then((isExistUser) => {
        if (isExistUser) {
          return res.json({ status: 500, msg: '用户已存在', data: null });
        }
        UsersModel.createUser(userInfo, (error) => {
          if (!error) return res.redirect('/admin');
          return res.json({ status: 500, msg: '数据库保存失败, 更换用户名试试!', data: null });
        });
      })
  }

  uploadImg(req, res) {
    return this.uploadImgFile(req, res);
  }
}

module.exports = RegisterController;
