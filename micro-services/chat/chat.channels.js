const ChannelModel = require('../../model/channels.model');

class ChannelService {

  async createIMChannel(appkey, targetState, sourceId, targetId) {
    const channelInfo = {
      appkey: appkey,
      channel_id: `${sourceId}@@${targetId}`,
      channel_state: 1,
      channel_members: targetState === 1 ? [sourceId, targetId] : [sourceId],
    };

    const chatChannelInfo = await ChannelModel.getChatChannel(sourceId, targetId);

    if (!channelInfo) {
      return await ChannelModel.createChatChannel(channelInfo);
    }

    const condition = { channel_id: channelInfo.channel_id };

    const updatedDoc = {
      channel_state: 1,
      channel_members: targetState === 1 ? [sourceId, targetId] : [sourceId],
    };

    return await ChannelModel.updateChatChannel(condition, updatedDoc);
  }

  async getChannelInfoBySourceIdAndTargetId(sourceId, targetId) {
    return await ChannelModel.getChatChannel(sourceId, targetId);
  }
}

module.exports = {
  ChannelService: new ChannelService(),
};
