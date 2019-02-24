
/**
 * channels service
 * 提供 im channels 的相关操作
 */

const ChannelModel = require('../../../model/channels.model').init();


class ChannelsService {

  /**
   * 用户登录 IM 服务，取得所有相关的 channels
   * 用户单聊 - channelId 为 `${sourceContactId}@@${targetContactId}`
   * 用户群聊 - channelId 为 groupId
   * 
   * @param {String} appkey 
   * @param {String} contactId 
   */
  async getContactRelatedChannelIds(appkey, contactId) {
    const channelsResult = await ChannelModel.getRelatedChannels(appkey, contactId);
    
    if (channelsResult.error) {
      return [];
    }

    return channelsResult.result.map(channel => channel.channel_id);
  }

  /**
   * 创建单聊聊天通道
   * @param {String} appkey 
   * @param {String} sourceId 
   * @param {String} targetId 
   */
  async createSingleChannel(appkey, sourceId, targetId) {
    const channelInfoResult = await ChannelModel.getSingleChannelInfo(appkey, sourceId, targetId);

    // 出现错误直接返回
    if (channelInfoResult.error) {
      return channelInfoResult;
    }

    // 创建过的 channel 直接返回
    if (channelInfoResult.result) {
      return channelInfoResult;
    }

    const channelInfo = { channel_id: `${sourceId}@@${targetId}` };

    return ChannelModel.createChannels(appkey, [channelInfo]);
  }

  /**
   * 创建群聊的聊天通道
   * @param {String} appkey 
   * @param {String} groupId 
   */
  async createGroupChannel(appkey, groupId) {
    const channelInfoResult = await ChannelModel.getGroupChannelInfo(appkey, groupId);

    // 出现错误直接返回
    if (channelInfoResult.error) {
      return channelInfoResult;
    }

    // 创建过的 channel 直接返回
    if (channelInfoResult.result) {
      return channelInfoResult;
    }

    const channelInfo = { channel_id: groupId };

    return ChannelModel.createChannels(appkey, [channelInfo]);
  }

  /**
   * 通过 contactId 获取 channel 信息
   * @param {String} appkey 
   * @param {String} sourceId 
   * @param {String} targetId 
   */
  async getChannelInfoBySourceIdAndTargetId(appkey, sourceId, targetId) {
    return ChannelModel.getSingleChannelInfo(appkey, sourceId, targetId);
  }
}

module.exports = {
  ChannelsService: new ChannelsService(),
}
