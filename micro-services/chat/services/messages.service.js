
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
   * 获取群组的历史消息
   * 群组消息 暂定为 全部已读
   * @param {String} appkey 
   * @param {String} channelId 
   */
  async getChannelHistoryMessages(appkey, channelId) {
    const condition = { appkey, message_channel: channelId };

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
   * 保存单聊聊天信息
   * 
   * @param {String} appkey 
   * @param {Object} channelInfo 
   * @param {Boolean} isOnLine 
   * @param {Object} message 
   */
  async saveIMSingleMessage(appkey, channelInfo, isOnLine, message) {
    const messageInfo = {
      message_type: message.type,
      message_channel: channelInfo.channel_id,
      message_state: isOnLine ? 1 : 0,
      message_source: message.source,
      message_target: message.target,
      message_target_group: null,
      message_content: message.content,
      appkey: appkey,
    };

    return MessageModel.addMessages(appkey, [messageInfo]);
  }

  /**
   * 保存群聊聊天信息
   * 
   * @param {String} appkey 
   * @param {String} channelId 
   * @param {String} message 
   */
  async saveIMGroupMessage(appkey, channelId, message) {
    const messageInfo = {
      message_type: message.type,
      message_channel: channelId,
      message_state: 1,
      message_source: message.source,
      message_target: null,
      message_target_group: message.target,
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
