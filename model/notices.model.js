const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const noticesSchema = require('../schema/notices.schema');
const utils = require('../providers/utils.provider');

class NoticesModel extends BaseModel {
  static init() {
    return new NoticesModel();
  }

  constructor(props) {
    super(props);
    this.noticesModel = mongoose.model('notices', noticesSchema);
  }

  // 添加通知
  async createNoticeInfos(appkey, noticeInfos) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(noticeInfos) !== 'Array') {
      return { result: null, error: this.paramsError };
    }
    const realNoticeInfos = noticeInfos.map((noticeInfo) => {
      return Object.assign({}, noticeInfo, { appkey });
    });

    return this.noticesModel.create(realNoticeInfos).then(this.resolve).catch(this.reject);
  }

  // 删除通知消息
  async removeNoticeInfos(appkey, noticeIds) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(noticeIds) !== 'Array') {
      return { result: null, error: this.paramsError };
    }

    const realNoticeIds = noticeIds.map((noticeId) => mongoose.Types.ObjectId(noticeId));

    const condition = { _id: { $in: realNoticeIds }, appkey };

    return this.noticesModel.deleteMany(condition).exec().then(this.resolve).catch(this.reject);
  }

  // 获取消息详情
  async getNoticeInfo(appkey, noticeId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(noticeId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const condition = { appkey, _id: mongoose.Types.ObjectId(noticeId) };

    return this.noticesModel.findOne(condition).exec().then(this.resolve).catch(this.reject);
  }

  // 更新消息信息
  async updateNoticeInfo(appkey, noticeId, updatedInfo) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(noticeId) !== 'String' || utils.checkType(updatedInfo) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    const condition = { _id: mongoose.Types.ObjectId(noticeId), appkey };

    return this.contactsModel.update(condition, updatedInfo).exec().then(this.resolve).catch(this.reject);
  }

}

module.exports = NoticesModel;
