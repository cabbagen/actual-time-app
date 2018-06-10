const ChannelModel = require('../../model/channels.model');
const { callbackDecorator } = require('../../kernel/core');

class ChannelService {
  createIMChannel(appkey, targetState, sourceId, targetId) {
    const channelInfo = {
      appkey: appkey,
      channel_id: `${sourceId}@@${targetId}`,
      channel_state: 1,
      channel_members: targetState === 1 ? [sourceId, targetId] : [sourceId],
    };

    return callbackDecorator(ChannelModel.createChatChannel.bind(ChannelModel), channelInfo);
  }

  getChannelInfoBySourceIdAndTargetId(sourceId, targetId) {
    return callbackDecorator(ChannelModel.getChatChannel.bind(ChannelModel), sourceId, targetId);
  }
}

module.exports = {
  ChannelService: new ChannelService(),
};
