const MessageModel = require('../../../model/messages.model');
const { ChannelService } = require('./chat.channels');

class MessageService {

  async saveIMMessage(appkey, messageState, messageType, message) {
    const channelInfo = await ChannelService.getChannelInfoBySourceIdAndTargetId(message.source, message.target);
    const messageInfo = {
      message_type: message.type,
      message_channel: channelInfo.channel_id,
      message_state: messageState,
      message_target_group: messageType === 1 ? message.target : null,
      message_content: message.content,
      message_source: message.source,
      message_target: messageType === 2 ? message.target : null,
      appkey: appkey,
    };

    return await MessageModel.addMessage(messageInfo);
  }

  async getMessageInfoByMessageId(messageId) {
    const params = { _id: messageId };
    return await MessageModel.getMessage(params);
  }

  async getUnreadMessages(socketId) {
    
  }
}

module.exports = {
  MessageService: new MessageService(),
};
