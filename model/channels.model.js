const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const channelsSchema = require('../schema/channels.schema');
const contactsSchema = require('../schema/contacts.schema');
const utils = require('../providers/utils.provider');

class ChannelsModel extends BaseModel {

  static init() {
    return new ChannelsModel();
  }

  constructor(props) {
    super(props);
    this.channelsModel = mongoose.model('channels', channelsSchema);
    this.contactModel = mongoose.model('contacts', contactsSchema);
  }

  /**
   * 创建聊天通道
   * @param {String} appkey
   * @param {Object} channelInfo 
   */
  async createChannels(appkey, channelInfos) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(channelInfos) !== 'Array') {
      return { result: null, error: this.paramsError };
    }
    const realChannelInfos = channelInfos.map((channelInfo) => {
      return Object.assign({}, channelInfo, { appkey });
    });

    return this.channelsModel.create(realChannelInfos).then(this.resolve).catch(this.reject);
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
   * 通过联系人获取单聊聊天通道信息
   * @param {String} appkey
   * @param {String} sourceConcactId 
   * @param {String} targetConcactId 
   */
  async getSingleChannelInfo(appkey, sourceConcactId, targetConcactId) {
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
   * 获取群聊聊天通道信息
   * @param {String} appkey 
   * @param {String} groupId 
   */
  async getGroupChannelInfo(appkey, groupId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    return this.channelsModel.findOne({ appkey, channel_id: groupId }).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 获取联系人相关的所有聊天信道
   * @param {String} appkey
   * @param {String} contactId 
   */
  async getRelatedChannels(appkey, contactId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const contactResult = await this.contactModel.findOne({ _id: mongoose.Types.ObjectId(contactId) }).exec().then(this.resolve).catch(this.reject);

    if (contactResult.error) {
      return contactResult;
    }

    const groupIds = contactResult.result.groups.map(groupId => groupId.toString());
    const condition = { $or: [ { channel_id: { $regex: contactId } }, { channel_id: { $in: groupIds } } ] }

    return this.channelsModel.find(condition).exec().then(this.resolve).catch(this.reject);
  }
}

module.exports = ChannelsModel;
