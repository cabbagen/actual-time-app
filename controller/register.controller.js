const BaseController = require('./base.controller.js');
const UsersModel = require('../model/users.model.js');
const cryptoProvider = require('../providers/crypto.provider.js');
const utilProvider = require('../providers/utils.provider.js');

class RegisterController extends BaseController {

  static init() {
    return new RegisterController();
  }

  registeUser(req, res) {
    const { avatorImg, ...userInfo } = req.body;

    if (!utilProvider.checkWebsiteAddress(userInfo.email)) {
      res.json({ status: 500, msg: '请输入正确的网址!', data: null });
      return;
    }

    const isExistUserPromise = this.isExistUser(userInfo.username);
    
    isExistUserPromise.then(isExistUser => {
      if (isExistUser) res.json({ status: 500, msg: '用户已存在', data: null });
      UsersModel.createUser(userInfo, (error, data) => {
        if (error) {
          res.json({ status: 500, msg: '数据库保存失败!', data: null });
        } else {
          res.json({ status: 200, msg: '操作成功', data });
        }
      });
    });
  }

  isExistUser(username) {
    return UsersModel.findOne({ username }).exec()
      .then((data) => {
        return !!data;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  uploadImg(req, res) {
    super.uploadImg(req, res, (error, imgUploadPaths) => {
      if (error) {
        res.json({ status: 500, data: null, msg: '图片上传失败' });
      }

      res.json({ status: 200, data: imgUploadPaths, msg: '图片上传成功' })
    });
  }
}

module.exports = RegisterController;
