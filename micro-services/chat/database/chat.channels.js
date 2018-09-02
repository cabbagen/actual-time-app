const ChannelModel = require('../../../model/channels.model').init();

class ChannelService {

  async createIMChannel(appkey, targetState, sourceId, targetId) {
    const channelInfo = {
      appkey: appkey,
      channel_id: `${sourceId}@@${targetId}`,
      channel_state: 1,
      channel_members: targetState === 1 ? [sourceId, targetId] : [sourceId],
    };

    const chatChannelInfo = await ChannelModel.getChannelInfo(sourceId, targetId);

    if (!chatChannelInfo) {
      return await ChannelModel.createChannel(channelInfo);
    }

    const condition = { channel_id: channelInfo.channel_id };

    const updatedDoc = {
      channel_state: 1,
      channel_members: targetState === 1 ? [sourceId, targetId] : [sourceId],
    };

    ChannelModel.updateChannel(condition, updatedDoc);
  }

  async resetIMChannel(sourceId, targetId) {
    const chatChannelInfo = await ChannelModel.getCurrentChannel(sourceId);

    if (!chatChannelInfo) {
      return;
    }

    const updatedDoc = {
      channel_state: 0,
      channel_members: chatChannelInfo.channel_members.length === 2 ? [targetId] : [],
    };

    ChannelModel.updateChannel({ _id: chatChannelInfo._id }, updatedDoc);
  }

  async getChannelInfoBySourceIdAndTargetId(sourceId, targetId) {
    return await ChannelModel.getChannelInfo(sourceId, targetId);
  }

  async getContactRelatedChannelIds(concactId) {
    const channels = await ChannelModel.getRelatedChannels(concactId, { channel_id: 1, _id: 0 });

    if (!channels) {
      return null;
    }

    return channels.map((channel) => channel.channel_id);
  }
}

module.exports = {
  ChannelService: new ChannelService(),
};
