const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');

const usersModel = require('../model/users.model.js');

class BaseController {
  
  constructor() {
    this.storageDir = path.resolve(__dirname, '../storage');
  }

  uploadFile() {
    console.log('this is file upload handle');
  }

  uploadImg(req, res) {
    const uploadImgDir = path.resolve(this.storageDir, 'images');

    console.log(uploadImgDir)

  }


}

module.exports = BaseController;