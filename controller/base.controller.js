const multiparty = require('multiparty');
const path = require('path');

class BaseController {
  
  constructor() {
    this.storageDir = path.resolve(__dirname, '../storage');
    this.replaceBasePath = path.resolve(__dirname, '../');
  }

  uploadFile() {
    console.log('this is file upload handle');
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
}

module.exports = BaseController;