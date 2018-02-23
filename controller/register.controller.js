const BaseController = require('./base.controller.js');
const UsersModel = require('../model/users.model.js');

class RegisterController extends BaseController {

  static init() {
    return new RegisterController();
  }

  registerUser(req, res) {

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
