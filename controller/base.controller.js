const multiparty = require('multiparty');
const path = require('path');

class BaseController {

  static init() {
    return new BaseController();
  }
  
  constructor() {
    this.storageDir = path.resolve(__dirname, '../storage');
    this.replaceBasePath = path.resolve(__dirname, '../');
  }

  uploadImgFile(req, res) {
    const uploadImgDir = path.resolve(this.storageDir, 'images');
    const form = new multiparty.Form({ uploadDir: uploadImgDir });

    form.parse(req, (error, fields, files) => {
      if (error) {
        return res.json({ status: 500, data: null, msg: error.message });
      }
      return res.json({
        status: 200,
        msg: '图片上传成功',
        data: files.imgFile.map(imgFile => imgFile.path.replace(this.replaceBasePath, '/static')),
      });
    });

    form.on('error', (error) => {
      return res.json({ status: 500, data: null, msg: error.message });
    });
  }

  returnSuccess(res, data) {
    res.json({ state: 200, msg: null, data });
  }

  returnAppKeyError(res, msg) {
    const errorMsg = msg || '请传入 appkey';
    res.json({ state: 201, msg: errorMsg, data: null });
  }

  returnParamsError(res, msg) {
    const errorMsg = msg || '请求参数错误';
    res.json({ state: 202, msg: errorMsg, data: null });
  }

  returnDatabaseError(res, msg) {
    const errorMsg = msg || '数据库操作失败';
    res.json({ state: 203, msg: errorMsg, data: null });
  }
}

module.exports = BaseController;