const ChannelModel = require('../../../model/channels.model');

class ChannelService {

  async createIMChannel(appkey, targetState, sourceId, targetId) {
    const channelInfo = {
      appkey: appkey,
      channel_id: `${sourceId}@@${targetId}`,
      channel_state: 1,
      channel_members: targetState === 1 ? [sourceId, targetId] : [sourceId],
    };

    const chatChannelInfo = await ChannelModel.getChatChannel(sourceId, targetId);

    if (!chatChannelInfo) {
      return await ChannelModel.createChatChannel(channelInfo);
    }

    const condition = { channel_id: channelInfo.channel_id };

    const updatedDoc = {
      channel_state: 1,
      channel_members: targetState === 1 ? [sourceId, targetId] : [sourceId],
    };

    return await ChannelModel.updateChatChannel(condition, updatedDoc);
  }

  async resetIMChannel(sourceId, targetId) {
    const chatChannelInfo = await ChannelModel.getChatChannel(sourceId, targetId);
    const updatedDoc = {
      channel_state: 1,
      channel_members: chatChannelInfo.channel_members.length === 2 ? [targetId] : [],
    };
    return await ChannelModel.updateChatChannel({ _id: chatChannelInfo._id }, updatedDoc);
  }

  async getChannelInfoBySourceIdAndTargetId(sourceId, targetId) {
    return await ChannelModel.getChatChannel(sourceId, targetId);
  }

  async getContactRelatedChannelIds(concactId) {
    const channels = await ChannelModel.getRelatedChannels(concactId, { channel_id: 1, _id: 0 });

    return channels.map(function(channel) {
      return channel.channel_id;
    });
  }
}

module.exports = {
  ChannelService: new ChannelService(),
};
