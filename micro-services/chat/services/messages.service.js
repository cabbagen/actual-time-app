
/**
 * messages service
 * 提供 im messages 的相关操作
 */
const mongoose = require('mongoose');
const MessageModel = require('../../../model/messages.model').init();

class MessagesService {

  /**
   * 获取指定聊天通道的未读消息
   * @param {String} appkey 
   * @param {String} channelId 
   */
  async getUnReadedChannelMessages(appkey, channelId) {
    const condition = { appkey, message_channel: channelId, message_state: 0 };

    return MessageModel.getMessages(appkey, condition);
  }

  /**
   * 标记指定聊天通道消息为 已读
   * @param {String} appkey 
   * @param {String} channelId 
   */
  async readChannelMessages(appkey, channelId) {
    const condition = { appkey, message_channel: channelId, message_state: 0 };
    const updatedInfo = { message_state: 1 };

    return MessageModel.updateMessages(appkey, condition, updatedInfo);
  }

  /**
   * 保存聊天信息
   * messageType   1 => 单人  2 => 群组
   * 
   * @param {String} appkey 
   * @param {Object} channelInfo 
   * @param {Boolean} isOnLine 
   * @param {Number} messageType 
   * @param {Object} message 
   */
  async saveIMMessage(appkey, channelInfo, isOnLine, messageType, message) {
    const messageInfo = {
      message_type: message.type,
      message_channel: channelInfo.channel_id,
      message_state: isOnLine ? 1 : 0,
      message_source: message.source,
      message_target: messageType === 1 ? message.target : null,
      message_target_group: messageType === 2 ? message.target : null,
      message_content: message.content,
      appkey: appkey,
    };

    return MessageModel.addMessages(appkey, [messageInfo]);
  }

  /**
   * 获取带有联系人信息的详细的消息对象
   * @param {String} appkey 
   * @param {String} messageId 
   */
  async getFullMessageInfoByMessageId(appkey, messageId) {
    const condition = { appkey, _id:  mongoose.Types.ObjectId(messageId) };
    return MessageModel.getMessages(appkey, condition);
  }
}

module.exports = {
  MessagesService: new MessagesService(),
}
