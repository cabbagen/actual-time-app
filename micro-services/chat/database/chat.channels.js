const ChannelModel = require('../../../model/channels.model').init();

class ChannelService {

  async createIMChannel(appkey, targetIsOnLine, sourceId, targetId) {
    const channelInfo = {
      appkey: appkey,
      channel_id: `${sourceId}@@${targetId}`,
      channel_state: 1,
      channel_members: targetIsOnLine ? [sourceId, targetId] : [sourceId],
    };

    const chatChannelInfoResult = await ChannelModel.getChannelInfo(sourceId, targetId);

    if (!chatChannelInfoResult.result) {
      ChannelModel.createChannel(channelInfo);
    }

    const condition = { channel_id: channelInfo.channel_id };

    const updatedDoc = {
      channel_state: 1,
      channel_members: targetIsOnLine ? [sourceId, targetId] : [sourceId],
    };

    ChannelModel.updateChannel(condition, updatedDoc);
  }

  async resetIMChannel(sourceId, targetId) {
    const chatChannelInfoResult = await ChannelModel.getCurrentChannel(sourceId);

    if (!chatChannelInfoResult.result) {
      return;
    }

    const updatedDoc = {
      channel_state: 0,
      channel_members: chatChannelInfoResult.result.channel_members.length === 2 ? [targetId] : [],
    };

    ChannelModel.updateChannel({ _id: chatChannelInfo._id }, updatedDoc);
  }

  async getChannelInfoBySourceIdAndTargetId(sourceId, targetId) {
    const channelInfoResult = await ChannelModel.getChannelInfo(sourceId, targetId);

    return channelInfoResult.result;
  }

  async getContactRelatedChannelIds(concactId) {
    const channelsResult = await ChannelModel.getRelatedChannels(concactId, { channel_id: 1, _id: 0 });

    if (!channelsResult.result) {
      return null;
    }

    return channelsResult.result.map((channel) => channel.channel_id);
  }
}

module.exports = {
  ChannelService: new ChannelService(),
};
