const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');

const usersModel = require('../model/users.model.js');

class BaseController {
  
  constructor() {
    this.storageDir = path.resolve(__dirname, '../storage');
    this.replaceBasePath = path.resolve(__dirname, '../');
  }

  uploadFile() {
    console.log('this is file upload handle');
  }

  uploadImg(req, res, callback) {
    const uploadImgDir = path.resolve(this.storageDir, 'images');
    const form = new multiparty.Form({ uploadDir: uploadImgDir });

    form.parse(req, (err, fields, files) => {
      if (err) callback(err, null);
      const imgUploadPaths = files.imgFile.map(imgFile => imgFile.path.replace(this.replaceBasePath, '/static'));

      callback(null, imgUploadPaths);
    });

    form.on('error', (err) => {
      callback(err, null);
    });
  }


}

module.exports = BaseController;