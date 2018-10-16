const mongoose = require('mongoose');
const moment = require('moment');
const BaseModel = require('./base.model');
const utils = require('../providers/utils.provider');
const messagesSchema = require('../schema/messages.schema');

class MessagesModel extends BaseModel {

  static init() {
    return new MessagesModel();
  }

  constructor(props) {
    super(props);
    this.messagesModel = mongoose.model('messages', messagesSchema);
  }

  async addMessage(message) {
    return this.messagesModel.create(message).then(this.resolve).catch(this.reject);
  }

  async getMessages(condition) {
    return this.messagesModel.find(condition)
      .populate('message_source')
      .populate('message_target')
      .exec()
      .then(this.resolve)
      .catch(this.reject);
  }

  async updateMessages(condition, updatedInfo) {
    return this.messagesModel.update(condition, updatedInfo, { multi: true })
      .exec()
      .then(this.resolve)
      .catch(this.reject);
  }

  /**
   * 获取 IM 用户的未读消息
   * @param {String} appkey 
   * @param {String} contactId 
   */
  async getContactUnReadMessages(appkey, contactId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String') {
      return { result: null, error: this.paramsError };
    }
    return this.messagesModel.aggregate([
      {
        $match: {
          $or: [
            { message_source: mongoose.Types.ObjectId(contactId) },
            { message_target: mongoose.Types.ObjectId(contactId) },
          ],
          message_state: 0,
        }
      },
      {
        $group: {
          _id: '$message_channel',
          last_message: { $last: '$message_content' },
          last_target: { $last: '$message_target' },
          last_target_group: { $last: '$message_target_group' },
          last_source: { $last: '$message_source' },
          last_time: { $last: '$created_at' },
          total: { $sum: 1 }
        }
      },
      {
        $lookup: { from: 'contacts', localField: 'last_target', foreignField: '_id', as: 'last_target' }
      },
      {
        $lookup: { from: 'contacts', localField: 'last_source', foreignField: '_id', as: 'last_source' }
      },
      {
        $lookup: { from: 'groups', localField: 'last_target_group', foreignField: '_id', as: 'last_target_group' }
      }
    ])
    .exec()
    .then(this.resolve)
    .catch(this.reject);
  }

  /**
   * 获取 IM 用户聊天记录
   * @param {String} appkey 
   * @param {String} fromContactId 
   * @param {String} toContactId 
   * @param {Object} condition 
   */
  async getContactMessages(appkey, fromContactId, toContactId, condition) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(fromContactId) !== 'String' || utils.checkType(toContactId) !== 'String' || utils.checkType(condition) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    const searchCondition = {
      appkey,
      message_source: mongoose.Types.ObjectId(fromContactId),
      message_target: mongoose.Types.ObjectId(toContactId),
    };

    if (condition.startTime && condition.endTime) {
      searchCondition.created_at = {
        $gt: new Date(moment(condition.startTime).toISOString()),
        $lt: new Date(moment(condition.endTime).toISOString()),
      };
    }
    return this.messagesModel.find(searchCondition).skip(condition.pageSize * condition.pageIndex).limit(condition.pageSize).then(this.resolve).catch(this.reject);
  }

  /**
   * 获取群组消息记录
   * @param {String} appkey 
   * @param {String} groupId
   * @param {Object} condition 
   */
  async getGroupMessages(appkey, groupId, condition) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String' || utils.checkType(condition) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    const searchCondition = { appkey, message_channel: groupId };

    if (condition.startTime && condition.endTime) {
      searchCondition.created_at = {
        $gt: new Date(moment(condition.startTime).toISOString()),
        $lt: new Date(moment(condition.endTime).toISOString()),
      };
    }
    return this.messagesModel.find(searchCondition).skip(condition.pageSize * condition.pageIndex).limit(condition.pageSize).then(this.resolve).catch(this.reject);
  }
 
  /**
   * 添加消息记录
   * @param {String} appkey 
   * @param {Object[]} messageInfos 
   */
  async addMessageInfos(appkey, messageInfos) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(messageInfos) !== 'Array') {
      return { result: null, error: this.paramsError };
    }
    const realMessageInfos = messageInfos.map((messageInfo) => {
      return Object.assign({}, messageInfo, { appkey });
    });

    return this.messagesModel.create(realMessageInfos).then(this.resolve).catch(this.reject);
  }

  /**
   * 获取消息信息
   * @param {String} appkey 
   * @param {String} messageId 
   */
  async getMessageInfo(appkey, messageId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(messageId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    return this.messagesModel.findOne({ appkey, _id: mongoose.Types.ObjectId(messageId) }).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 删除消息记录
   * @param {String} appkey 
   * @param {String[]} messageIds 
   */
  async removeMessages(appkey, messageIds) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(messageIds) !== 'Array') {
      return { result: null, error: this.paramsError };
    }

    const realMessageIds = messageIds.map(messageId => mongoose.Types.ObjectId(messageId));

    return this.messagesModel.remove({ appkey, _id: { $in: realMessageIds } }).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 更新消息记录
   * @param {String} appkey 
   * @param {String} messageId 
   * @param {Object} messageInfo 
   */
  async updateMessageInfo(appkey, messageId, messageInfo) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(messageId) !== 'String' || utils.checkType(messageInfo) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    const condition = { appkey, _id: mongoose.Types.ObjectId(messageId) };
    const document = Object.assign({}, messageInfo, { appkey });

    return this.messagesModel.update(condition,document).exec().then(this.resolve).catch(this.reject);
  }
}

module.exports = MessagesModel;
