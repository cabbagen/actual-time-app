const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const channelsSchema = require('../schema/channels.schema');
const utils = require('../providers/utils.provider');

class ChannelsModel extends BaseModel {

  static init() {
    return new ChannelsModel();
  }

  constructor(props) {
    super(props);
    this.channelsModel = mongoose.model('channels', channelsSchema);
  }

  /**
   * 创建聊天通道
   * @param {String} appkey
   * @param {Object} channelInfo 
   */
  async createChannels(appkey, channelInfo) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(channelInfo) !== 'Object') {
      return { result: null, error: this.paramsError };
    }
    const realChannelInfo = Object.assign({}, channelInfo, { appkey });
    return this.channelsModel.create([realChannelInfo]).then(this.resolve).catch(this.reject);
  }

  /**
   * 更新聊天通道
   * @param {String} appkey
   * @param {Object} condition
   * @param {Object} updatedInfo
   */
  async updateChannel(appkey, condition, updatedInfo) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(condition) !== 'Object' || utils.checkType(updatedInfo) !== 'Object') {
      return { result: null, error: this.paramsError };
    }
    const realCondition = Object.assign({}, condition, { appkey });

    return this.channelsModel.update(realCondition, updatedInfo).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 通过联系人获取聊天通道信息
   * @param {String} appkey
   * @param {String} sourceConcactId 
   * @param {String} targetConcactId 
   */
  async getChannelInfo(appkey, sourceConcactId, targetConcactId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(sourceConcactId) !== 'String' || utils.checkType(targetConcactId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const relevantChannels = [
      `${sourceConcactId}@@${targetConcactId}`,
      `${targetConcactId}@@${sourceConcactId}`,
    ];

    return this.channelsModel.findOne({ appkey, channel_id: { $in: relevantChannels } }).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 仅适用于单聊模式
   * 获取用户当前使用的聊天通道
   * @param {String} appkey
   * @param {String} contactId 
   */
  async getCurrentChannel(appkey, contactId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const condition = { appkey, channel_state: 1, channel_id: { $regex: contactId } };

    return this.channelsModel.findOne(condition).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 获取联系人相关的所有聊天信道
   * @param {String} appkey
   * @param {String} contactId 
   */
  async getRelatedChannels(appkey, contactId, selectedFeildObj) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    return this.channelsModel.find({ channel_id: { $regex: contactId } }).exec().then(this.resolve).catch(this.reject);
  }
}

module.exports = ChannelsModel;
