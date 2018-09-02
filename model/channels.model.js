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

  async createChannel(channelInfo) {
    return await this.channelsModel.create(channelInfo).then(this.resolve).catch(this.reject);
  }

  async updateChannel(condition, updatedInfo) {
    return await this.channelsModel.update(condition, updatedInfo)
      .exec()
      .then(this.resolve)
      .then(this.reject);
  }

  async getChannelInfo(sourceConcactId, targetConcactId) {
    const channelFirstId = `${sourceConcactId}@@${targetConcactId}`;
    const channelSeconedId = `${targetConcactId}@@${sourceConcactId}`;

    const channelInfo = await this.channelsModel.findOne({ channel_id: { $in: [channelFirstId, channelSeconedId] } }).exec();

    return channelInfo || null;
  }

  // 获取用户当前使用的聊天通道
  async getCurrentChannel(contactId) {
    const channelInfo = await this.channelsModel.findOne({ channel_id: { $regex: contactId }, channel_state: 1 }).exec();
    
    return channelInfo || null;
  }

  // 获取联系人相关的所有聊天信道
  async getRelatedChannels(contactId, selected) {
    const channelInfos = await this.channelsModel.find({ channel_id: { $regex: contactId } }, selected).exec();

    return channelInfos || null;
  }
}

module.exports = ChannelsModel;
