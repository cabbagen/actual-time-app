const MessageModel = require('../../model/messages.model');
const { callbackDecorator } = require('../../kernel/core');
const { ChannelService } = require('./chat.channels');

class MessageService {

  saveIMMessage(appkey, messageState, messageType, message) {
    return ChannelService.getChannelInfoBySourceIdAndTargetId(message.source, message.target).then((result) => {
      const messageInfo = {
        message_type: message.type,
        message_channel: result.channel_id,
        message_state: messageState,
        message_target_group: messageType === 1 ? message.target : null,
        message_content: message.content,
        message_source: message.source,
        message_target: messageType === 2 ? message.target : null,
        appkey: appkey,
      };

      return callbackDecorator(MessageModel.addMessage.bind(MessageModel), messageInfo);
    });
  }

  getMessageInfoByMessageId(messageId) {
    const params = { _id: messageId };
    return callbackDecorator(MessageModel.getMessage.bind(MessageModel, params));
  }
}

module.exports = {
  MessageService: new MessageService(),
};
