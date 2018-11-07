const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const channelsSchema = require('../schema/channels.schema');

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
   * @param {Object} channelInfo 
   */
  async createChannel(channelInfo) {
    return this.channelsModel.create(channelInfo).then(this.resolve).catch(this.reject);
  }

  /**
   * 更新聊天通道
   * @param {Object} condition
   * @param {Object} updatedInfo
   */
  async updateChannel(condition, updatedInfo) {
    return this.channelsModel.update(condition, updatedInfo)
      .exec()
      .then(this.resolve)
      .catch(this.reject);
  }

  /**
   * 通过联系人获取聊天通道信息
   * @param {String} sourceConcactId 
   * @param {String} targetConcactId 
   */
  async getChannelInfo(sourceConcactId, targetConcactId) {
    const channelFirstId = `${sourceConcactId}@@${targetConcactId}`;
    const channelSeconedId = `${targetConcactId}@@${sourceConcactId}`;

    return this.channelsModel.findOne({ channel_id: { $in: [channelFirstId, channelSeconedId] } })
      .exec()
      .then(this.resolve)
      .catch(this.reject);
  }

  /**
   * 获取用户当前使用的聊天通道
   * @param {String} contactId 
   */
  async getCurrentChannel(contactId) {
    return this.channelsModel.findOne({ channel_id: { $regex: contactId }, channel_state: 1 })
      .exec()
      .then(this.resolve)
      .catch(this.reject);
  }

  /**
   * 获取联系人相关的所有聊天信道
   * @param {String} contactId 
   * @param {Object} selectedFeildObj 
   */
  async getRelatedChannels(contactId, selectedFeildObj) {
    return this.channelsModel.find({ channel_id: { $regex: contactId } }, selectedFeildObj)
      .exec()
      .then(this.resolve)
      .catch(this.reject);
  }
}

module.exports = ChannelsModel;
