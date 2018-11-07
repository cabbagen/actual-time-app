const mongoose = require('mongoose');
const MessageModel = require('../../../model/messages.model').init();
const { ChannelService } = require('./chat.channels');

class MessageService {
  // messageType   1 => 群组  2 => 单人
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

    const messageResult = await MessageModel.addMessage(messageInfo);

    return messageResult.result;
  }

  async getMessageInfoByMessageId(messageId) {
    const params = { _id: mongoose.Types.ObjectId(messageId) };
    const messagesResult = await MessageModel.getMessages(params);

    if (messagesResult.error) {
      return null;
    }
    return messagesResult.result[0];
  }

  async getSignalUnreadMessages(sourceId, targetId) {
    const condition = {
      $or: [
        { message_channel: `${sourceId}@@${targetId}` },
        { message_channel: `${targetId}@@${sourceId}` }
      ],
      message_state: 0,
    };

    const unreadMessagesResult = await MessageModel.getMessages(condition);

    if (unreadMessagesResult.error) {
      return [];
    }
    return unreadMessagesResult.result;
  }

  async readMessages(channelId) {
    const condition = { message_channel: channelId };
    const params = { message_state: 1 };

    MessageModel.updateMessages(condition, params);
  }
}

module.exports = {
  MessageService: new MessageService(),
};
