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

    callbackDecorator(ChannelModel.getChatChannel.bind(ChannelModel), sourceId, targetId).then((data) => {
      if (data) {
        const condition = { channel_id: data.channel_id };
        const updatedDoc = {
          channel_state: 1,
          channel_members: targetState === 1 ? [sourceId, targetId] : [sourceId],
        };
        return callbackDecorator(ChannelModel.updateChatChannel.bind(ChannelModel), condition, updatedDoc);
      } else {
        return callbackDecorator(ChannelModel.createChatChannel.bind(ChannelModel), channelInfo);
      }
    });
  }

  getChannelInfoBySourceIdAndTargetId(sourceId, targetId) {
    return callbackDecorator(ChannelModel.getChatChannel.bind(ChannelModel), sourceId, targetId);
  }
}

module.exports = {
  ChannelService: new ChannelService(),
};
