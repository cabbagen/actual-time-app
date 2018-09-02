const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const usersSchema = require('../schema/users.schema');
const cryptoProvider = require('../providers/crypto.provider.js');
const utilsProvider = require('../providers/utils.provider.js');

class UsersModel extends BaseModel {

  static init() {
    return new UsersModel();
  }

  constructor(props) {
    super(props);
    this.usersModel = mongoose.model('users', usersSchema);
  }

  async getUserInfoByUserName(username) {
    const userInfo = await this.usersModel.findOne({ username }).exec();
    return userInfo || null;
  }

  async createUser(userInfo) {
    const params = Object.assign({}, userInfo, {
      password: cryptoProvider.getSaledHashSync(userInfo.password),
      appkey: utilsProvider.makeRandomAppkey(),
    });

    return await this.usersModel.create(params).then(this.resolve).catch(this.reject);
  }
}

module.exports = UsersModel;
